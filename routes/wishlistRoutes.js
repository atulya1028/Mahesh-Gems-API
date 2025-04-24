const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, addToWishlist);
router.get("/", verifyToken, getWishlist);
router.delete("/:id", verifyToken, removeFromWishlist);
router.delete("/", verifyToken, clearWishlist); // New endpoint

module.exports = router;