const Razorpay = require("razorpay");
const crypto = require("crypto");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Address = require("../models/Address");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Proceed to Checkout
exports.proceedToCheckout = async (req, res) => {
  try {
    const { addressId } = req.body;
    const userId = req.user.userId;

    // Fetch cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch address
    const address = await Address.findById(addressId);
    if (!address || address.userId.toString() !== userId) {
      return res.status(400).json({ message: "Invalid address" });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create Razorpay order
    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database
    const order = new Order({
      userId,
      items: cart.items,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      shippingAddress: {
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
        phone: address.phone,
      },
    });
    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: "✅ Order created",
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount * 100,
      currency: "INR",
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Update order status
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "completed";
    await order.save();

    res.status(200).json({ message: "✅ Payment verified and captured" });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Address Management
exports.addAddress = async (req, res) => {
  try {
    const { name, street, city, state, country, postalCode, phone, isDefault } = req.body;
    const userId = req.user.userId;

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = new Address({
      userId,
      name,
      street,
      city,
      state,
      country,
      postalCode,
      phone,
      isDefault,
    });
    await address.save();

    res.status(201).json({ message: "✅ Address added", address });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { name, street, city, state, country, postalCode, phone, isDefault } = req.body;
    const userId = req.user.userId;

    const address = await Address.findById(addressId);
    if (!address || address.userId.toString() !== userId) {
      return res.status(400).json({ message: "Invalid address" });
    }

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    address.name = name || address.name;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.postalCode = postalCode || address.postalCode;
    address.phone = phone || address.phone;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await address.save();
    res.status(200).json({ message: "✅ Address updated", address });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.userId;

    const address = await Address.findById(addressId);
    if (!address || address.userId.toString() !== userId) {
      return res.status(400).json({ message: "Invalid address" });
    }

    await address.remove();
    res.status(200).json({ message: "✅ Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};