const Jewelry = require("../models/Jewelry");

exports.createJewelry = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required" });
    }

    const images = req.files.images ? req.files.images.map(file => file.path) : [];
    const videos = req.files.videos ? req.files.videos.map(file => file.path) : [];
    
    const newJewelry = new Jewelry({
      title,
      price,
      images,
      videos,
      description,
    });
    await newJewelry.save();
    res.status(201).json({ message: "✅ Jewelry item created", jewelry: newJewelry });
  } catch (error) {
    console.error("Error in createJewelry:", error);
    if (error.message.includes("Cloudinary")) {
      return res.status(500).json({ error: "Failed to upload files to Cloudinary", details: error.message });
    }
    if (error.name === "MongoError" || error.name === "MongooseError") {
      return res.status(500).json({ error: "Database operation failed", details: error.message });
    }
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

exports.getAllJewelry = async (req, res) => {
  try {
    const items = await Jewelry.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJewelryById = async (req, res) => {
  try {
    const item = await Jewelry.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "❌ Jewelry item not found" });
    
    if (item.image && (!item.images || item.images.length === 0)) {
      item.images = [item.image];
    }
    
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};console.log("Creating new jewelry item...");
console.log("Request body:", req.body);
console.log("Request files:", req.files);
console.log("New jewelry item created:", newJewelry);
console.log("Error in createJewelry:", error);
console.log("Error details:", error.message);
console.log("Getting all jewelry items...");
console.log("Jewelry items:", items);
console.log("Getting jewelry item by ID...");
console.log("Jewelry item:", item);
console.log("Error in getJewelryById:", error);
console.log("Error details:", error.message);