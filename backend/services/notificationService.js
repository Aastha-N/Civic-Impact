const { query } = require('../config/db');

/**
 * Dispatches an in-app notification to a user
 */
async function createNotification({ userId, title, message, type = 'general', referenceId = null }) {
  try {
    const sql = `
      INSERT INTO notifications (user_id, title, message, type, reference_id, is_read, created_at)
      VALUES ($1, $2, $3, $4, $5, 0, CURRENT_TIMESTAMP)
      RETURNING id, user_id, title, message, type, reference_id, is_read, created_at;
    `;
    const res = await query(sql, [userId, title, message, type, referenceId ? String(referenceId) : null]);
    return res.rows[0];
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
}

/**
 * Awards Green Points and records transaction history
 */
async function awardGreenPoints({ userId, points, activityType, description, referenceId = null }) {
  try {
    if (!points || points <= 0) return;

    // 1. Record transaction in green_point_transactions
    const transSql = `
      INSERT INTO green_point_transactions (user_id, points, activity_type, description, reference_id, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING id, points;
    `;
    await query(transSql, [userId, points, activityType, description, referenceId ? String(referenceId) : null]);

    // 2. Increment user's total green points
    const userSql = `
      UPDATE users
      SET green_points = COALESCE(green_points, 0) + $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, name, green_points;
    `;
    const userRes = await query(userSql, [points, userId]);

    // 3. Notify user of points earned
    await createNotification({
      userId,
      title: '🌱 Green Points Earned!',
      message: `You earned +${points} Green Points for: ${activityType} (${description})!`,
      type: 'points',
      referenceId
    });

    return userRes.rows[0];
  } catch (error) {
    console.error('Error awarding green points:', error.message);
  }
}

module.exports = {
  createNotification,
  awardGreenPoints
};
