const express = require('express');
const router = express.Router();
const {
  getProductsByUser,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductByUrl,
  getUserDashboardMetrics
} = require('../storage');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/products/metrics (Dashboard KPI metrics)
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await getUserDashboardMetrics(req.user.id);
    res.json({ success: true, metrics });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to compute dashboard metrics.' });
  }
});

// POST /api/products/check-duplicate
router.post('/check-duplicate', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.json({ isDuplicate: false });
    }
    const existing = await findProductByUrl(req.user.id, url);
    if (existing) {
      return res.json({
        isDuplicate: true,
        product: existing,
        message: 'You already saved this product ❤️'
      });
    }
    res.json({ isDuplicate: false });
  } catch (err) {
    res.status(500).json({ isDuplicate: false });
  }
});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await getProductsByUser(req.user.id, req.query);
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { title, price } = req.body;
    if (!title && !req.body.url) {
      return res.status(400).json({ success: false, message: 'Product title or URL is required.' });
    }

    const result = await createProduct(req.user.id, req.body);
    if (result.isDuplicate) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: result.message,
        existingProduct: result.existingProduct
      });
    }

    res.status(201).json({
      success: true,
      isDuplicate: false,
      message: 'Product saved to your GlowWear universe! ✨',
      product: result.product
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to save product.' });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.user.id, req.body);
    res.json({ success: true, message: 'Product updated.', product: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteProduct(req.params.id, req.user.id);
    res.json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
