const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");

// Seed demo user
router.post("/seed-demo", async (req, res) => {
  const db = await connectDB();
  await db.collection("users").deleteMany({});

  const demo = {
    userId: "demo-user-001",
    email: "hire-me@anshumat.org",
    password: "HireMe@2025!",
    userTier: "NEW",
    country: "IN",
    lifetimeSpend: 0,
    ordersPlaced: 0
  };

  await db.collection("users").insertOne(demo);

  res.json({ message: "Demo user created", demo });
});

// Login
router.post("/login", async (req, res) => {
  const db = await connectDB();
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email, password });

  if (!user) return res.status(401).json({ error: "Invalid login" });

  res.json({ message: "Login passed", token: "demo-token", user });
});

module.exports = router;
