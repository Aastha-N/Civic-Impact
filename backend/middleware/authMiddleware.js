const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'civic_impact_jwt_secret_token_key_2026_super_safe';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.'
      });
    }

    // Fetch user from DB
    const userRes = await query(
      'SELECT id, name, email, phone, address, role, green_points, avatar_url, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    req.user = userRes.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
}

// Optional Auth (for public routes that personalize if token is provided)
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'civic_impact_jwt_secret_token_key_2026_super_safe';
      const decoded = jwt.verify(token, secret);
      const userRes = await query(
        'SELECT id, name, email, phone, address, role, green_points, avatar_url, created_at FROM users WHERE id = $1',
        [decoded.userId]
      );
      if (userRes.rows.length > 0) {
        req.user = userRes.rows[0];
      }
    }
  } catch (err) {
    // Ignore invalid tokens in optional auth
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth
};
