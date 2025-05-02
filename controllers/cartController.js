const Cart = require("../models/Cart");
const Jewelry = require("../models/Jewelry");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
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
      // Item exists, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        jewelryId,
        title: jewelry.title,
        price: jewelry.price,
        image: jewelry.image,
        description: jewelry.description,
        quantity,
      });
    }

    await cart.save();
    res.status(200).json({ message: "✅ Added to cart", cart });
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

    cart.items = cart.items.filter((item) => {
      const id = item.jewelryId._id ? item.jewelryId._id.toString() : item.jewelryId.toString();
      return id !== jewelryId;
    });

    await cart.save();
    res.status(200).json({ message: "✅ Removed from cart", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "✅ Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { jewelryId } = req.params;
    const { quantity } = req.body;
    
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => 
      (item.jewelryId._id ? item.jewelryId._id.toString() : item.jewelryId.toString()) === jewelryId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "✅ Cart item quantity updated", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};