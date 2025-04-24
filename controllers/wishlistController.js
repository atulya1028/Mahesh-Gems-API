const Wishlist = require("../models/Wishlist");

exports.addToWishlist = async (req, res) => {
  try {
    const { jewelryId } = req.body;
    const userId = req.user.id;

    const existingItem = await Wishlist.findOne({ user: userId, jewelry: jewelryId });
    if (existingItem) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    const wishlistItem = new Wishlist({
      user: userId,
      jewelry: jewelryId,
    });

    await wishlistItem.save();
    
    const count = await Wishlist.countDocuments({ user: userId });
    
    res.status(201).json({
      message: "Item added to wishlist",
      wishlistItem,
      wishlistCount: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const wishlistItems = await Wishlist.find({ user: userId })
      .populate("jewelry")
      .sort({ createdAt: -1 });
    
    const count = await Wishlist.countDocuments({ user: userId });

    res.json({
      wishlistItems,
      wishlistCount: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const wishlistItem = await Wishlist.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    const count = await Wishlist.countDocuments({ user: userId });

    res.json({
      message: "Item removed from wishlist",
      wishlistCount: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};