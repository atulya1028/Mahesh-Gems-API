const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load .env file explicitly
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  console.error("Error loading .env file:", dotenvResult.error.message);
  process.exit(1);
}

const app = express();

// Validate critical environment variables
const requiredEnvVars = ["MONGO_URI", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "JWT_SECRET"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not defined in .env file or environment variables.`);
    process.exit(1);
  }
}

// Configure CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://mahesh-gems.vercel.app",
      "http://localhost:5173",
    ];
    console.log(`CORS Request Origin: ${origin || "No origin"}`);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS Rejected Origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(morgan("dev")); // Log HTTP requests
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime(), mongodb: mongoose.connection.readyState });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jewelry", require("./routes/jewelryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Global error middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message, err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// MongoDB connection with retry
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      console.log("Attempting MongoDB connection...");
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected successfully");
      break;
    } catch (err) {
      console.error(`MongoDB connection attempt failed: ${err.message}`);
      retries -= 1;
      if (retries === 0) {
        console.error("MongoDB connection failed after all retries");
        process.exit(1);
      }
      console.log(`Retrying MongoDB connection in 5 seconds... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};
connectWithRetry();

// Start server for non-Vercel environments
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless
module.exports = app;