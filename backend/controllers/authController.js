const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { awardGreenPoints, createNotification } = require('../services/notificationService');

const JWT_SECRET = process.env.JWT_SECRET || 'civic_impact_jwt_secret_token_key_2026_super_safe';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Register Citizen
 */
async function register(req, res) {
  try {
    const { name, email, phone, password, confirmPassword, address } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Phone, Password, Address).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default role is citizen
    const insertSql = `
      INSERT INTO users (name, email, phone, password_hash, address, role, green_points, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, 'citizen', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, name, email, phone, address, role, green_points, created_at;
    `;
    const insertRes = await query(insertSql, [name.trim(), email.trim().toLowerCase(), phone.trim(), passwordHash, address.trim()]);
    const newUser = insertRes.rows[0];

    // Welcome Green Points & In-app Notification
    await awardGreenPoints({
      userId: newUser.id,
      points: 20,
      activityType: 'Welcome Bonus',
      description: 'Joined Civic Impact Community'
    });

    await createNotification({
      userId: newUser.id,
      title: 'Welcome to Civic Impact! 🌍',
      message: 'Thank you for taking a step towards a cleaner, smarter city. Explore civic complaints, waste pickup, and reuse marketplace.',
      type: 'system'
    });

    // Generate JWT
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Refresh user to get updated points
    const freshUser = await query('SELECT id, name, email, phone, address, role, green_points, created_at FROM users WHERE id = $1', [newUser.id]);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome bonus 20 Green Points awarded.',
      token,
      user: freshUser.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration: ' + error.message });
  }
}

/**
 * Login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const userRes = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Exclude password_hash
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login: ' + error.message });
  }
}

/**
 * Get Current User Profile
 */
async function getProfile(req, res) {
  try {
    const userRes = await query(
      'SELECT id, name, email, phone, address, role, green_points, avatar_url, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: userRes.rows[0]
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
}

/**
 * Update Profile
 */
async function updateProfile(req, res) {
  try {
    const { name, phone, address, avatar_url } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({ success: false, message: 'Name, phone, and address are required.' });
    }

    const updateSql = `
      UPDATE users
      SET name = $1, phone = $2, address = $3, avatar_url = COALESCE($4, avatar_url), updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, name, email, phone, address, role, green_points, avatar_url, updated_at;
    `;
    const resUpdate = await query(updateSql, [name.trim(), phone.trim(), address.trim(), avatar_url || null, req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: resUpdate.rows[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
}

/**
 * Change Password
 */
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }

    // Get current hash
    const userRes = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, userRes.rows[0].password_hash);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newHash, req.user.id]);

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error changing password.' });
  }
}

/**
 * Get User Activity Timeline
 */
async function getUserActivity(req, res) {
  try {
    const userId = req.user.id;

    const complaints = await query(
      'SELECT id, complaint_id, title, category, status, priority, created_at FROM complaints WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    const pickups = await query(
      'SELECT id, pickup_id, waste_type, quantity, status, preferred_date, created_at FROM waste_pickup_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    const listings = await query(
      'SELECT id, title, category, listing_type, availability_status, created_at FROM reuse_listings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    const pointHistory = await query(
      'SELECT id, points, activity_type, description, created_at FROM green_point_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [userId]
    );

    res.json({
      success: true,
      activity: {
        complaints: complaints.rows,
        pickups: pickups.rows,
        listings: listings.rows,
        points: pointHistory.rows
      }
    });
  } catch (error) {
    console.error('User activity error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user activity.' });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUserActivity
};
