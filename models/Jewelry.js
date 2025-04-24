const mongoose = require("mongoose");

const jewelrySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Match external API's string id
    name: { type: String, required: true }, // Changed from title to name
    price: { type: Number, required: true }, // Changed to Number
    image: { type: String, required: true },
    description: { type: String },
    category: { type: String }, // Added for completeness
  },
  { collection: "jewelry" } // Explicitly set collection name
);

module.exports = mongoose.model("Jewelry", jewelrySchema);