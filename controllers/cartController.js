const Cart = require("../models/Cart");
const Jewelry = require("../models/Jewelry");

exports.getCart = async (req, res) => {
  try {
    console.log("Fetching cart for user:", req.user.userId); // Debug: Log user ID
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      console.log("Cart not found, returning empty items"); // Debug
      return res.status(200).json({ items: [] });
    }
    console.log("Cart found:", cart); // Debug: Log cart
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCart:", error); // Debug: Log error
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    console.log("Adding to cart, user:", req.user.userId, "jewelryId:", req.body.jewelryId, "quantity:", req.body.quantity); // Debug: Log user, jewelryId, quantity
    const { jewelryId, quantity = 1 } = req.body;
    if (!jewelryId) {
      return res.status(400).json({ message: "jewelryId is required" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });
    console.log("Existing cart:", cart); // Debug: Log existing cart

    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
      console.log("Created new cart:", cart); // Debug
    }

    const jewelry = await Jewelry.findById(jewelryId);
    if (!jewelry) {
      console.log("Jewelry not found for ID:", jewelryId); // Debug
      return res.status(404).json({ message: "Jewelry item not found" });
    }
    console.log("Jewelry found:", jewelry); // Debug: Log jewelry item

    const itemIndex = cart.items.findIndex((item) => item.jewelryId.toString() === jewelryId);
    
    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.items[itemIndex].quantity += quantity;
      console.log("Updated item quantity:", cart.items[itemIndex]); // Debug
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
      console.log("Added new item to cart:", cart.items[cart.items.length - 1]); // Debug
    }

    await cart.save();
    console.log("Cart updated:", cart); // Debug: Log updated cart
    res.status(200).json({ message: "✅ Added to cart", cart });
  } catch (error) {
    console.error("Error in addToCart:", error); // Debug: Log error
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    console.log("Removing from cart, user:", req.user.userId, "jewelryId:", req.params.jewelryId); // Debug
    const { jewelryId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      console.log("Cart not found for user:", req.user.userId); // Debug
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => {
      const id = item.jewelryId._id ? item.jewelryId._id.toString() : item.jewelryId.toString();
      return id !== jewelryId;
    });

    await cart.save();
    console.log("Cart after removal:", cart); // Debug
    res.status(200).json({ message: "✅ Removed from cart", cart });
  } catch (error) {
    console.error("Error in removeFromCart:", error); // Debug
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    console.log("Clearing cart for user:", req.user.userId); // Debug
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      console.log("Cart not found for user:", req.user.userId); // Debug
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    console.log("Cart cleared:", cart); // Debug
    res.status(200).json({ message: "✅ Cart cleared", cart });
  } catch (error) {
    console.error("Error in clearCart:", error); // Debug
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    console.log("Updating cart item quantity, user:", req.user.userId, "jewelryId:", req.params.jewelryId, "quantity:", req.body.quantity); // Debug
    const { jewelryId } = req.params;
    const { quantity } = req.body;
    
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      console.log("Cart not found for user:", req.user.userId); // Debug
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => 
      (item.jewelryId._id ? item.jewelryId._id.toString() : item.jewelryId.toString()) === jewelryId
    );

    if (itemIndex === -1) {
      console.log("Item not found in cart:", jewelryId); // Debug
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    console.log("Cart after quantity update:", cart); // Debug

    res.status(200).json({ message: "✅ Cart item quantity updated", cart });
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error); // Debug
    res.status(500).json({ error: error.message });
  }
};