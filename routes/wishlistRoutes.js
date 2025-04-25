const express = require("express");
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require("../controllers/wishlistController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, getWishlist);
router.post("/", verifyToken, addToWishlist);
router.delete("/:jewelryId", verifyToken, removeFromWishlist);
router.delete("/", verifyToken, clearWishlist);

module.exports = router;