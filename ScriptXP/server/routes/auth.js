const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user with 100 starting XP
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, userId, password } = req.body;

    // Validate all fields are present
    if (!name || !email || !userId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Check if userId already exists
    const userIdExists = await User.findOne({ userId });
    if (userIdExists) {
      return res.status(400).json({ message: 'User ID already taken! Choose a different coder alias.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with starting 100 XP
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      userId,
      password: hashedPassword,
      xp: 100,
      level: 1,
      badges: ['Early Adopter'],
    });

    // Generate token and respond
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        xp: user.xp,
        level: user.level,
        class: user.class,
        skills: user.skills,
        badges: user.badges,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token and respond
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        xp: user.xp,
        level: user.level,
        class: user.class,
        skills: user.skills,
        badges: user.badges,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile settings
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      if (req.body.name) user.name = req.body.name;
      if (req.body.email) {
        // Check if email already exists for another user
        const existingEmail = await User.findOne({ email: req.body.email.toLowerCase() });
        if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
           return res.status(400).json({ message: 'This email is already registered to another account.' });
        }
        user.email = req.body.email.toLowerCase();
      }
      
      if (req.body.userId && req.body.userId !== user.userId) {
        // Check if new userId is already taken
        const existingId = await User.findOne({ userId: req.body.userId });
        if (existingId && existingId._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: 'User ID alias is already in use.' });
        }
        user.userId = req.body.userId;
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        userId: updatedUser.userId,
        xp: updatedUser.xp,
        level: updatedUser.level,
        class: updatedUser.class,
        skills: updatedUser.skills,
        badges: updatedUser.badges,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// @route   PUT /api/auth/profile/reset
// @desc    Permanently reset user XP, levels, and badges back to defaults
// @access  Private
router.put('/profile/reset', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.xp = 100;
      user.level = 1;
      user.badges = ['Early Adopter'];
      
      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        userId: updatedUser.userId,
        xp: updatedUser.xp,
        level: updatedUser.level,
        class: updatedUser.class,
        skills: updatedUser.skills,
        badges: updatedUser.badges,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Progress reset error:', error);
    res.status(500).json({ message: 'Server error during progress reset' });
  }
});

// @route   DELETE /api/auth/profile
// @desc    Permanently delete the user account entirely from the database
// @access  Private
router.delete('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // Use Mongoose deleteOne to safely remove
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'Account has been permanently deleted.' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ message: 'Server error during account deletion process' });
  }
});

module.exports = router;

