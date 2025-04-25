const Cart = require("../models/Cart");
const Jewelry = require("../models/Jewelry");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.jewelryId");
    if (!cart) {
      return res.status(200).json({ items: [], subtotal: 0 });
    }
    const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    res.status(200).json({ items: cart.items, subtotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { jewelryId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }

    const jewelry = await Jewelry.findById(jewelryId);
    if (!jewelry) {
      return res.status(404).json({ message: "Jewelry item not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.jewelryId.toString() === jewelryId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        jewelryId,
        title: jewelry.title,
        price: jewelry.price,
        image: jewelry.image,
        quantity,
      });
    }

    await cart.save();
    const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    res.status(200).json({ message: "✅ Added to cart", items: cart.items, subtotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { jewelryId } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.jewelryId.toString() === jewelryId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const jewelry = await Jewelry.findById(jewelryId);
    if (!jewelry || (jewelry.stock && quantity > jewelry.stock)) {
      return res.status(400).json({ message: `Only ${jewelry.stock || 0} items in stock` });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    res.status(200).json({ message: "✅ Cart updated", items: cart.items, subtotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { jewelryId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.jewelryId.toString() !== jewelryId);
    await cart.save();
    const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    res.status(200).json({ message: "✅ Removed from cart", items: cart.items, subtotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(200).json({ message: "✅ Cart already empty", items: [], subtotal: 0 });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "✅ Cart cleared", items: [], subtotal: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};