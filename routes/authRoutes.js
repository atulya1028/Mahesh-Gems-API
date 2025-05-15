const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  refreshToken,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", refreshToken);
router.get("/me", verifyToken, getUserProfile);
router.put("/me", verifyToken, updateUserProfile);

module.exports = router;