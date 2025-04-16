// /api/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (with cache for Vercel serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const jewelryRoutes = require("./routes/jewelryRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jewelry", jewelryRoutes);

app.get("/api", (req, res) => {
  res.send("🚀 API is running on Vercel...");
});

// Export the serverless handler
module.exports.handler = serverless(app);
