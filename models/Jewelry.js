const mongoose = require("mongoose");

const jewelrySchema = new mongoose.Schema({
  title: String,
  price: String,
  image:String,
  images: [String],
  videos: [String],
  description: String,
});

module.exports = mongoose.model("Jewelry", jewelrySchema);