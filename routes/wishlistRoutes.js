const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { addToWishlist, removeFromWishlist, getWishlist, clearWishlist } = require("../controllers/wishlistController");

router.post("/add", verifyToken, addToWishlist);
router.delete("/remove/:jewelryId", verifyToken, removeFromWishlist);
router.get("/", verifyToken, getWishlist);
router.delete("/", verifyToken, clearWishlist);

module.exports = router;