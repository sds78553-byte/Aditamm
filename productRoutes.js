const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 🔵 Create Product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, storeId, category, stock, imageUrl } = req.body;

    if (!name || !description || !price || !storeId) {
      return res.status(400).json({ error: 'Required fields missing.' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      storeId,
      category: category || 'Uncategorized',
      stock: stock ?? 0,
      imageUrl: imageUrl || ''
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('🔥 POST /api/products error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🔵 Get All Products (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { storeId, category, search } = req.query;
    let query = {};

    if (storeId) query.storeId = storeId;
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).populate('storeId', 'name');
    res.json(products);
  } catch (error) {
    console.error('🔥 GET /api/products error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🔵 Get Single Product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('storeId', 'name');
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    res.json(product);
  } catch (error) {
    console.error(`🔥 GET /api/products/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🟠 Update Product by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: 'Product not found.' });

    res.json(updatedProduct);
  } catch (error) {
    console.error(`🔥 PUT /api/products/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🔴 Delete Product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found.' });

    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error(`🔥 DELETE /api/products/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

module.exports = router;
