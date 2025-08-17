// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      default: 0,
    },
    countInStock: {
      type: Number,
      required: [true, 'Product stock count is required'],
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to User model
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Model Creation
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
