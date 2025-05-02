const Jewelry = require("../models/Jewelry");

exports.getJewelryById = async (req, res) => {
  try {
    const jewelry = await Jewelry.findById(req.params.id);
    if (!jewelry) {
      return res.status(404).json({ message: "Jewelry not found" });
    }
    res.status(200).json(jewelry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllJewelry = async (req, res) => {
  try {
    const jewelry = await Jewelry.find();
    res.status(200).json(jewelry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createJewelry = async (req, res) => {
  try {
    const { title, description, price, category, media, stock } = req.body;
    const jewelry = new Jewelry({
      title,
      description,
      price,
      category,
      media, // Array of { url, type }
      stock,
    });
    await jewelry.save();
    res.status(201).json(jewelry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateJewelry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, media, stock } = req.body;
    const jewelry = await Jewelry.findByIdAndUpdate(
      id,
      { title, description, price, category, media, stock },
      { new: true }
    );
    if (!jewelry) {
      return res.status(404).json({ message: "Jewelry not found" });
    }
    res.status(200).json(jewelry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteJewelry = async (req, res) => {
  try {
    const { id } = req.params;
    const jewelry = await Jewelry.findByIdAndDelete(id);
    if (!jewelry) {
      return res.status(404).json({ message: "Jewelry not found" });
    }
    res.status(200).json({ message: "Jewelry deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};