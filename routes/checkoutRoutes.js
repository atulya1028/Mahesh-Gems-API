const express = require("express");
const router = express.Router();
const {
  proceedToCheckout,
  verifyPayment,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/checkoutController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/checkout", verifyToken, proceedToCheckout);
router.post("/verify-payment", verifyToken, verifyPayment);
router.post("/address", verifyToken, addAddress);
router.get("/addresses", verifyToken, getAddresses);
router.put("/address/:addressId", verifyToken, updateAddress);
router.delete("/address/:addressId", verifyToken, deleteAddress);

module.exports = router;