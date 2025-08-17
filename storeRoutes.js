const express = require('express');
const router = express.Router();
const Store = require('../models/store');
const User = require('../models/user'); // Required for user existence check
const mongoose = require('mongoose');

// Utility
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');

// Middleware: Validate Required Fields
const validateStoreFields = (req, res, next) => {
  const { businessName, businessType, user } = req.body;
  if (!businessName || !businessType || !user) {
    return res.status(400).json({
      success: false,
      error: 'Fields "businessName", "businessType", and "user" are required.',
    });
  }
  next();
};

// Generate unique slug
const generateUniqueSlug = async (base) => {
  let slug = generateSlug(base);
  let exists = await Store.findOne({ slug });
  let counter = 1;
  while (exists) {
    slug = `${generateSlug(base)}-${counter++}`;
    exists = await Store.findOne({ slug });
  }
  return slug;
};

// 📦 CREATE STORE
router.post('/', validateStoreFields, async (req, res) => {
  try {
    const { businessName, user, slug } = req.body;

    // User existence check
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const duplicate = await Store.findOne({ businessName, user });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: 'Store with this business name already exists for this user.',
      });
    }

    req.body.slug = slug ? generateSlug(slug) : await generateUniqueSlug(businessName);
    req.body.domain = `${req.body.slug}.droppyshop.com`;

    const store = new Store(req.body);
    const saved = await store.save();
    res.status(201).json({ success: true, store: saved });
  } catch (error) {
    console.error('🔥 POST /api/stores error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

// 🔍 GET ALL STORES
router.get('/', async (req, res) => {
  try {
    const { search, user, plan, active } = req.query;
    let filter = {};

    if (search) filter.businessName = { $regex: search, $options: 'i' };
    if (user && isValidObjectId(user)) filter.user = user;
    if (plan) filter.plan = plan;
    if (active !== undefined) filter.isActive = active === 'true';

    const stores = await Store.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: stores.length, stores });
  } catch (error) {
    console.error('🔥 GET /api/stores error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

// 🔍 GET STORE BY ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid store ID format.' });
    }

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found.' });
    }

    res.json({ success: true, store });
  } catch (error) {
    console.error(`🔥 GET /api/stores/${req.params.id} error:`, error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

// ⚙️ UPDATE STORE BY ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid store ID format.' });
    }

    const updated = await Store.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Store not found.' });
    }

    res.json({ success: true, store: updated });
  } catch (error) {
    console.error(`🔥 PUT /api/stores/${id} error:`, error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

// ❌ DELETE STORE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid store ID format.' });
    }

    const deleted = await Store.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Store not found.' });
    }

    res.json({ success: true, message: 'Store deleted successfully.' });
  } catch (error) {
    console.error(`🔥 DELETE /api/stores/${id} error:`, error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

// 📊 PATCH STORE ANALYTICS
router.patch('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const { visitors = 0, orders = 0, revenue = 0 } = req.body;

    const store = await Store.findByIdAndUpdate(
      id,
      {
        $inc: {
          'analytics.visitors': visitors,
          'analytics.orders': orders,
          'analytics.revenue': revenue,
        },
      },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found.' });
    }

    res.json({ success: true, store });
  } catch (error) {
    console.error('🔥 PATCH /analytics error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

// 🌐 CHECK DOMAIN AVAILABILITY (future support)
router.get('/check-domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const exists = await Store.findOne({ domain });
    res.json({ available: !exists });
  } catch (error) {
    console.error('🔥 GET /check-domain error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
