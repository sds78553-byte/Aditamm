// routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// 🔵 Create Category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const category = new Category({ name, description });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('🔥 POST /api/categories error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🔵 Get All Categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('🔥 GET /api/categories error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🔵 Get Single Category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    console.error('🔥 GET /api/categories/:id error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🟠 Update Category
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
    res.json(updatedCategory);
  } catch (error) {
    console.error('🔥 PUT /api/categories/:id error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🔴 Delete Category
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('🔥 DELETE /api/categories/:id error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

module.exports = router;
