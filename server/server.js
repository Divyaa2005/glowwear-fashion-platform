require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./storage');

const authRoutes = require('./routes/auth');
const collectionRoutes = require('./routes/collections');
const productRoutes = require('./routes/products');
const scrapeRoutes = require('./routes/scrape');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize DB
initDb().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'GlowWear 2.0 API',
    version: '2.0.0',
    time: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// In production, serve React static build
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexHtml = path.join(buildPath, 'index.html');
    return res.sendFile(indexHtml, err => {
      if (err) {
        next();
      }
    });
  }
  next();
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start listener only when run directly (not when imported for serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✨ GlowWear 2.0 API Server running on port ${PORT}`);
    console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
