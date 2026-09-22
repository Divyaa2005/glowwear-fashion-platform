const jwt = require('jsonwebtoken');
const { findUserById } = require('../storage');

const JWT_SECRET = process.env.JWT_SECRET || 'glowwear-super-secret-jwt-key-2026';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or session expired.' });
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
  }
  next();
}

function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '30d' });
}

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken,
  JWT_SECRET
};
