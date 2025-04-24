const User = require("../models/User");
const Jewelry = require("../models/Jewelry");

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { jewelryId } = req.body;
    const userId = req.user.userId;

    // Check if jewelry exists
    const jewelry = await Jewelry.findById(jewelryId);
    if (!jewelry) {
      return res.status(404).json({ message: "Jewelry item not found" });
    }

    // Find user and update wishlist
    let user = await User.findById(userId);
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if item is already in wishlist
    if (user.wishlist.includes(jewelryId)) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    // Add to wishlist
    user.wishlist.push(jewelryId);
    await user.save();

    // Get updated wishlist count
    const wishlistCount = user.wishlist.length;

    res.status(200).json({
      message: "✅ Item added to wishlist",
      wishlistCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { jewelryId } = req.params;
    const userId = req.user.userId;

    // Find user and update wishlist
    const user = await User.findById(userId);
    if (!user.wishlist || !user.wishlist.includes(jewelryId)) {
      return res.status(400).json({ message: "Item not in wishlist" });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter((id) => id.toString() !== jewelryId);
    await user.save();

    res.status(200).json({
      message: "✅ Item removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user and populate wishlist with jewelry details
    const user = await User.findById(userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "✅ Wishlist retrieved successfully",
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear user's wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user and clear wishlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = [];
    await user.save();

    res.status(200).json({
      message: "✅ Wishlist cleared successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};