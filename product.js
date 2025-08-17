const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST: Create Product
router.post('/add', async (req, res) => {
  try {
    const { name, description, images, category, stock, price } = req.body;

    const newProduct = new Product({
      name,
      description,
      images,
      category,
      stock,
      price,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

// GET: All products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

module.exports = router;

