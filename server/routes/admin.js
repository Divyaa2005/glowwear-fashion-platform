const express = require('express');
const router = express.Router();
const { getAdminAnalytics, getAllUsers } = require('../storage');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken, requireAdmin);

// GET /api/admin/analytics
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await getAdminAnalytics();
    res.json({ success: true, analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin analytics.' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users list.' });
  }
});

module.exports = router;
