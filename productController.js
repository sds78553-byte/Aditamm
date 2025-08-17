const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

// @desc   Get all products with pagination, search, sorting
// @route  GET /api/products
// @access Public
const getAllProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const category = req.query.category
    ? { category: req.query.category }
    : {};

  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;

  const filter = { ...keyword, ...category };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc   Create a product
// @route  POST /api/products
// @access Public (later: Admin only)
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock, images } = req.body;

  if (!name || !price) {
    res.status(400).json({ message: 'Name and price are required' });
    return;
  }

  const product = new Product({
    name,
    price,
    description,
    category,
    stock,
    images,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc   Get product by ID
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Admin (later protected)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc   Update a product
// @route  PUT /api/products/:id
// @access Admin (later protected)
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, images } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.stock = stock || product.stock;
  product.images = images || product.images;

  const updatedProduct = await product.save();
  res.status(200).json(updatedProduct);
});

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
};
