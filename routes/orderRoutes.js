const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

router.post("/create", authMiddleware, orderController.createRazorpayOrder);
router.post("/verify", authMiddleware, orderController.verifyPayment);
router.post("/address", authMiddleware, orderController.addAddress);
router.get("/addresses", authMiddleware, orderController.getAddresses);
router.get("/", authMiddleware, orderController.getOrders);

module.exports = router;