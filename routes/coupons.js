const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");
const { evaluateEligibilityAndDiscount, selectBestCoupon } = require("../services/evaluator");

// Create coupon
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    const body = req.body;

    // Unique code check
    const exists = await db.collection("coupons").findOne({ code: body.code });
    if (exists) return res.status(409).json({ error: "Coupon code already exists" });

    await db.collection("coupons").insertOne(body);
    res.status(201).json({ message: "Coupon created", coupon: body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List coupons
router.get("/", async (req, res) => {
  const db = await connectDB();
  const coupons = await db.collection("coupons").find().toArray();
  res.json({ coupons });
});

// Best coupon
router.post("/best", async (req, res) => {
  const db = await connectDB();
  const { user, cart } = req.body;

  const coupons = await db.collection("coupons").find().toArray();
  const now = new Date();
  const eligible = [];

  for (const coupon of coupons) {
    // Date validity
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) continue;

    // Usage limit
    const usage = await db.collection("usages").findOne({
      userId: user.userId,
      couponCode: coupon.code
    });

    if (coupon.usageLimitPerUser && usage?.count >= coupon.usageLimitPerUser)
      continue;

    // Eligibility logic
    const result = evaluateEligibilityAndDiscount(coupon, user, cart);
    if (result.eligible)
      eligible.push({ coupon, discount: result.discountAmount });
  }

  if (eligible.length === 0)
    return res.json({ best: null });

  const best = selectBestCoupon(eligible);

  res.json({
    best: {
      code: best.coupon.code,
      discount: best.discount,
      description: best.coupon.description
    }
  });
});

// Record coupon usage
router.post("/record-usage", async (req, res) => {
  const db = await connectDB();
  const { userId, code } = req.body;

  const usage = await db.collection("usages").findOne({ userId, couponCode: code });

  if (!usage) {
    await db.collection("usages").insertOne({
      userId,
      couponCode: code,
      count: 1
    });
  } else {
    await db.collection("usages").updateOne(
      { userId, couponCode: code },
      { $inc: { count: 1 } }
    );
  }

  res.json({ message: "Usage updated" });
});

module.exports = router;
