const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changePassword,
} = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", verifyToken, getUserProfile);
router.put("/me", verifyToken, updateUserProfile);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;