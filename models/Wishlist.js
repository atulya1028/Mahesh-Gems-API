const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      jewelryId: { type: mongoose.Schema.Types.ObjectId, ref: "Jewelry", required: true },
      title: String,
      price: String,
      image: String,
      description: String,
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
