const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
} = require("../controllers/cartController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, getCart);
router.post("/", verifyToken, addToCart);
router.delete("/:jewelryId", verifyToken, removeFromCart);
router.delete("/", verifyToken, clearCart);
router.put("/:jewelryId", verifyToken, updateCartItemQuantity);

module.exports = router;