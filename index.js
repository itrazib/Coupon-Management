require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/coupons", require("./routes/coupons"));

app.get("/", (req, res) => {
  res.send("Coupon Management API (Native MongoDB Driver) Running...");
});

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log("Server running on port", process.env.PORT);
});
