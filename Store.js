// models/store.js
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  description: String,
  address: String,
  contact: String,

  // 🔑 Relations
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // 🌐 Domain + slug
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  domain: {
    type: String,
    unique: true,
  },

  // 📊 Analytics
  analytics: {
    visitors: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },

  // ⚙️ Plan & status
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  isActive: { type: Boolean, default: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Store', storeSchema);
