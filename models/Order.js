const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      jewelryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jewelry",
        required: true,
      },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      description: { type: String },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  shippingAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);