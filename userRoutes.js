const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); // ✅ token function

// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.toLowerCase()?.trim();
  const password = req.body.password?.trim();

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed. Try again later.' });
  }
});

// @route   POST /api/users/login
// @desc    Login user and return token + info
router.post('/login', async (req, res) => {
  const email = req.body.email?.toLowerCase()?.trim();
  const password = req.body.password?.trim();

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed. Try again later.' });
  }
});

module.exports = router;
