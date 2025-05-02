const Wishlist = require("../models/Wishlist");
const Jewelry = require("../models/Jewelry");

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });
    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { jewelryId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.userId, items: [] });
    }

    const jewelry = await Jewelry.findById(jewelryId);
    if (!jewelry) {
      return res.status(404).json({ message: "Jewelry item not found" });
    }

    const itemExists = wishlist.items.some((item) => item.jewelryId.toString() === jewelryId);
    if (itemExists) {
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
    res.status(200).json({ message: "✅ Added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { jewelryId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter((item) => {
      const id = item.jewelryId._id ? item.jewelryId._id.toString() : item.jewelryId.toString();
      return id !== jewelryId;
    });

    await wishlist.save();
    res.status(200).json({ message: "✅ Removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = [];
    await wishlist.save();
    res.status(200).json({ message: "✅ Wishlist cleared", wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
