const Jewelry = require("../models/Jewelry");

exports.createJewelry = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug: Log request body
    console.log("Request files:", req.files); // Debug: Log uploaded files

    const { title, price, description } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required" });
    }

    const images = req.files.images
      ? req.files.images.map((file) => {
          console.log("Image upload result:", file); // Debug: Log each image
          return file.path;
        })
      : [];
    const videos = req.files.videos
      ? req.files.videos.map((file) => {
          console.log("Video upload result:", file); // Debug: Log each video
          return file.path;
        })
      : [];

    const newJewelry = new Jewelry({
      title,
      price,
      images,
      videos,
      description,
    });

    console.log("Saving jewelry item:", newJewelry); // Debug: Log before save
    await newJewelry.save();
    console.log("Jewelry item saved successfully"); // Debug: Log after save

    res
      .status(201)
      .json({ message: "✅ Jewelry item created", jewelry: newJewelry });
  } catch (error) {
    console.error("Error in createJewelry:", error); // Debug: Log error details
    if (error.message.includes("Cloudinary")) {
      return res.status(500).json({ error: "Failed to upload files to Cloudinary" });
    }
    if (error.name === "MongoError" || error.name === "MongooseError") {
      return res.status(500).json({ error: "Database error occurred" });
    }
    res.status(500).json({ error: "A server error occurred: " + error.message });
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
};