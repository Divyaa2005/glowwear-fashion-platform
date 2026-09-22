const express = require('express');
const router = express.Router();
const { extractMetadata } = require('../services/extractor');
const { authenticateToken } = require('../middleware/auth');

// POST /api/scrape/extract
router.post('/extract', authenticateToken, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Please provide a product URL.' });
    }

    const result = await extractMetadata(url);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to extract product details.',
      needsManualInput: true
    });
  }
});

module.exports = router;
