const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      jewelryId: { type: mongoose.Schema.Types.ObjectId, ref: "Jewelry", required: true },
      title: String,
      price: String,
      image: String,
      quantity: { type: Number, default: 1, min: 1 },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);