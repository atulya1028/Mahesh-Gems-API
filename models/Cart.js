const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  jewelryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jewelry",
    required: true,
  },
  title: String,
  price: String,
  image: String,
  description: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemSchema],
});

module.exports = mongoose.model("Cart", cartSchema);