const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { 
  findUserByEmail, 
  findUserById, 
  createUser, 
  updateUser, 
  createPasswordResetToken, 
  resetPasswordWithToken,
  resetUserPassword
} = require('../storage');
const { authenticateToken, generateToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const newUser = await createUser({ name, email, password });
    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: newUser,
      token
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user.id, user.role);
    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Welcome back to GlowWear!',
      user: safeUser,
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updatedUser = await updateUser(req.user.id, { name, avatar });
    res.json({ success: true, message: 'Profile updated successfully!', user: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to update profile.' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const user = await findUserById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    await updateUser(req.user.id, { newPassword });
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your account email address.' });
    }

    const resetData = await createPasswordResetToken(email);
    res.json({
      success: true,
      message: 'Reset token generated successfully (valid for 15 minutes).',
      email: resetData.email,
      name: resetData.name,
      resetToken: resetData.token
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Unable to process password reset.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both email and your new password.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    let result;
    if (resetToken) {
      result = await resetPasswordWithToken(email, resetToken, newPassword);
    } else {
      result = await resetUserPassword(email, newPassword);
    }
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Password reset failed.' });
  }
});

module.exports = router;

