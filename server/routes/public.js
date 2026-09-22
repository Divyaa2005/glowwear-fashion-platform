const express = require('express');
const router = express.Router();
const { getCollectionByShareId } = require('../storage');

// GET /api/public/collections/:shareId
router.get('/collections/:shareId', async (req, res) => {
  try {
    const col = await getCollectionByShareId(req.params.shareId);
    if (!col) {
      return res.status(404).json({ success: false, message: 'Collection not found or has been made private.' });
    }
    res.json({ success: true, collection: col });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message || 'Access denied.' });
  }
});

module.exports = router;
