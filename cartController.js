const Cart = require('../models/Cart');

// POST /api/cart - Add to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.status(200).json(cart);
};

// GET /api/cart - Get cart items
const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.status(200).json(cart || { items: [] });
};

// PUT /api/cart/:productId - Update quantity
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(i => i.product.toString() === productId);
  if (item) {
    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } else {
    res.status(404).json({ message: 'Product not in cart' });
  }
};

// DELETE /api/cart/:productId - Remove item
const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();

  res.status(200).json(cart);
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart
};
