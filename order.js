// routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 🔵 Create Order
router.post('/', async (req, res) => {
  try {
    const { userId, products, totalAmount, status } = req.body;

    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Invalid order data.' });
    }

    const newOrder = new Order({ userId, products, totalAmount, status });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('🔥 POST /api/orders error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🔵 Get All Orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');
    res.json(orders);
  } catch (error) {
    console.error('🔥 GET /api/orders error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🔵 Get Single Order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (error) {
    console.error(`🔥 GET /api/orders/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🟠 Update Order Status
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found.' });
    res.json(updatedOrder);
  } catch (error) {
    console.error(`🔥 PUT /api/orders/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// 🔴 Delete Order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ error: 'Order not found.' });
    res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error(`🔥 DELETE /api/orders/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

module.exports = router;
