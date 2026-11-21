const { query } = require('../config/db');

/**
 * Get User Notifications
 */
async function getNotifications(req, res) {
  try {
    const userId = req.user.id;

    const notifSql = `
      SELECT id, title, message, type, reference_id, is_read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50;
    `;
    const result = await query(notifSql, [userId]);

    const unreadCount = result.rows.filter(n => !n.is_read).length;

    res.json({
      success: true,
      unreadCount,
      notifications: result.rows
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
  }
}

/**
 * Mark Single Notification as Read
 */
async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [id, userId]);

    res.json({
      success: true,
      message: 'Notification marked as read.'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error updating notification.' });
  }
}

/**
 * Mark All Notifications as Read
 */
async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id;

    await query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, message: 'Server error updating notifications.' });
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
