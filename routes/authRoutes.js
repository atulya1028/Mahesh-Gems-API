const express = require("express");
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword } = require("../controllers/authController");

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

module.exports = router;
