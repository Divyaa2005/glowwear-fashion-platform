const express = require('express');
const router = express.Router();
const {
  getCollectionsByUser,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  getProductsByUser
} = require('../storage');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/collections
router.get('/', async (req, res) => {
  try {
    const collections = await getCollectionsByUser(req.user.id);
    res.json({ success: true, collections });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch collections.' });
  }
});

// POST /api/collections
router.post('/', async (req, res) => {
  try {
    const { title, description, emoji, isPublic } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Collection title is required.' });
    }
    const newCol = await createCollection(req.user.id, { title, description, emoji, isPublic });
    res.status(201).json({ success: true, message: 'Collection created! ✨', collection: newCol });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to create collection.' });
  }
});

// GET /api/collections/:id
router.get('/:id', async (req, res) => {
  try {
    const col = await getCollectionById(req.params.id, req.user.id);
    if (!col) {
      return res.status(404).json({ success: false, message: 'Collection not found.' });
    }
    const products = await getProductsByUser(req.user.id, { collectionId: col.id });
    res.json({ success: true, collection: col, products });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
});

// PUT /api/collections/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await updateCollection(req.params.id, req.user.id, req.body);
    res.json({ success: true, message: 'Collection updated.', collection: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/collections/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteCollection(req.params.id, req.user.id);
    res.json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
