const Jewelry = require("../models/Jewelry");

exports.createJewelry = async (req, res) => {
  try {
    const { title, price, description } = req.body;
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
    res
      .status(201)
      .json({ message: "✅ Jewelry item created", jewelry: newJewelry });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};