const Wishlist = require("../models/Wishlist");
const Jewelry = require("../models/Jewelry");

exports.getWishlist = async (req, res) => {
  try {
    console.log("Fetching wishlist for user:", req.user.userId); // Debug: Log user ID
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });
    if (!wishlist) {
      console.log("Wishlist not found, returning empty items"); // Debug
      return res.status(200).json({ items: [] });
    }
    console.log("Wishlist found:", wishlist); // Debug: Log wishlist
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error in getWishlist:", error); // Debug: Log error
    res.status(500).json({ error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    console.log("Adding to wishlist, user:", req.user.userId, "jewelryId:", req.body.jewelryId); // Debug: Log user and jewelryId
    const { jewelryId } = req.body;
    if (!jewelryId) {
      return res.status(400).json({ message: "jewelryId is required" });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.userId });
    console.log("Existing wishlist:", wishlist); // Debug: Log existing wishlist

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.userId, items: [] });
      console.log("Created new wishlist:", wishlist); // Debug
    }

    const jewelry = await Jewelry.findById(jewelryId);
    if (!jewelry) {
      console.log("Jewelry not found for ID:", jewelryId); // Debug
      return res.status(404).json({ message: "Jewelry item not found" });
    }
    console.log("Jewelry found:", jewelry); // Debug: Log jewelry item

    const itemExists = wishlist.items.some((item) => item.jewelryId.toString() === jewelryId);
    if (itemExists) {
      console.log("Item already in wishlist:", jewelryId); // Debug
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    wishlist.items.push({
      jewelryId,
      title: jewelry.title,
      price: jewelry.price,
      image: jewelry.image,
      description: jewelry.description,
    });

    await wishlist.save();
    console.log("Wishlist updated:", wishlist); // Debug: Log updated wishlist
    res.status(200).json({ message: "✅ Added to wishlist", wishlist });
  } catch (error) {
    console.error("Error in addToWishlist:", error); // Debug: Log error
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    console.log("Removing from wishlist, user:", req.user.userId, "jewelryId:", req.params.jewelryId); // Debug
    const { jewelryId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });

    if (!wishlist) {
      console.log("Wishlist not found for user:", req.user.userId); // Debug
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter((item) => {
      const id = item.jewelryId._id ? item.jewelryId._id.toString() : item.jewelryId.toString();
      return id !== jewelryId;
    });

    await wishlist.save();
    console.log("Wishlist after removal:", wishlist); // Debug
    res.status(200).json({ message: "✅ Removed from wishlist", wishlist });
  } catch (error) {
    console.error("Error in removeFromWishlist:", error); // Debug
    res.status(500).json({ error: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    console.log("Clearing wishlist for user:", req.user.userId); // Debug
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });

    if (!wishlist) {
      console.log("Wishlist not found for user:", req.user.userId); // Debug
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = [];
    await wishlist.save();
    console.log("Wishlist cleared:", wishlist); // Debug
    res.status(200).json({ message: "✅ Wishlist cleared", wishlist });
  } catch (error) {
    console.error("Error in clearWishlist:", error); // Debug
    res.status(500).json({ error: error.message });
  }
};