const Wishlist = require("../models/Wishlist");
const Jewelry = require("../models/Jewelry");

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });
    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { jewelryId } = req.body;
    const userId = req.user.userId;

    const jewelry = await Jewelry.findById(jewelryId);
    if (!jewelry) {
      return res.status(404).json({ message: "Jewelry not found" });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    if (!wishlist.items.some((item) => item.jewelryId.toString() === jewelryId)) {
      wishlist.items.push({
        jewelryId,
        title: jewelry.title,
        image: jewelry.media.find((m) => m.type === "image")?.url || "",
        price: jewelry.price,
      });
      await wishlist.save();
    }

    res.status(200).json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { jewelryId } = req.body;
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter((item) => item.jewelryId.toString() !== jewelryId);
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};