import express from 'express';
import User from '../models/User.js';
import { auth, generateToken } from '../middleware/auth.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    
    // Handle nested structure if present
    let name, email, password, location, bio;
    
    if (typeof req.body.email === 'object' && req.body.email.email) {
      // Nested structure
      name = req.body.name || req.body.email.name;
      email = req.body.email.email;
      password = req.body.email.password;
      location = req.body.location || req.body.email.location;
      bio = req.body.bio || req.body.email.bio;
    } else {
      // Normal structure
      name = req.body.name;
      email = req.body.email;
      password = req.body.password;
      location = req.body.location;
      bio = req.body.bio;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      location,
      bio
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password) and token
    const userResponse = user.getPublicProfile();
    userResponse.email = user.email; // Include email for registration

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    console.log('Email type:', typeof req.body.email);
    console.log('Password type:', typeof req.body.password);
    
    // Handle nested structure if present
    let email, password;
    
    if (typeof req.body.email === 'object' && req.body.email.email) {
      // Nested structure: { email: { email: '...', password: '...' } }
      email = req.body.email.email;
      password = req.body.email.password;
    } else {
      // Normal structure: { email: '...', password: '...' }
      email = req.body.email;
      password = req.body.password;
    }
    
    // Ensure we have the correct data types
    email = typeof email === 'string' ? email : String(email);
    password = typeof password === 'string' ? password : String(password);
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data and token
    const userResponse = user.getPublicProfile();
    userResponse.email = user.email; // Include email for login

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const userResponse = req.user.getPublicProfile();
    userResponse.email = req.user.email; // Include email for current user
    
    res.json({
      user: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error getting profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, location, bio, isPublic, skillsOffered, skillsWanted, availability } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (skillsOffered !== undefined) updateData.skillsOffered = skillsOffered;
    if (skillsWanted !== undefined) updateData.skillsWanted = skillsWanted;
    if (availability !== undefined) updateData.availability = availability;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    const userResponse = user.getPublicProfile();
    userResponse.email = user.email;

    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error changing password' });
  }
});

export default router; 