const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // NEW: Check for duplicate email before creating a new user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret', // Replace 'defaultsecret' with your secure secret in .env
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected route example
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Fetch user data from MongoDB
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'host') {
      // NEW: Return host-specific data
      return res.status(200).json({
        message: `Welcome to your dashboard, ${user.name}!`,
        role: user.role,
        hostFeatures: {
          bio: user.bio,
          offerings: user.offerings || [], // Mock data or real offerings
          bookings: [], // Mock or real booking data
          ratings: user.ratings || 0,
        },
      });
    } else {
      // NEW: Return traveler-specific data
      return res.status(200).json({
        message: `Welcome to your dashboard, ${user.name}!`,
        role: user.role,
        travelerFeatures: {
          trips: [], // Mock or real trip data
          wishlist: [], // Mock or real wishlist data
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
