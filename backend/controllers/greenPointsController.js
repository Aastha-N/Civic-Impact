const { query } = require('../config/db');

/**
 * Get Current User Green Points & History
 */
async function getMyPoints(req, res) {
  try {
    const userId = req.user.id;

    // Fetch user total points
    const userRes = await query('SELECT green_points FROM users WHERE id = $1', [userId]);
    const balance = userRes.rows[0]?.green_points || 0;

    // Fetch transactions
    const transRes = await query(
      `SELECT id, points, activity_type, description, reference_id, created_at
       FROM green_point_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    // Calculate user rank
    const rankRes = await query(
      `SELECT COUNT(*) + 1 as rank FROM users WHERE green_points > $1 AND role = 'citizen'`,
      [balance]
    );

    res.json({
      success: true,
      balance,
      rank: parseInt(rankRes.rows[0]?.rank || 1, 10),
      transactions: transRes.rows
    });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching green points.' });
  }
}

/**
 * Get Community Leaderboard (Privacy-friendly: Name, Points, Activities count. No emails/phones!)
 */
async function getLeaderboard(req, res) {
  try {
    const { timeframe = 'overall' } = req.query;

    let sql;
    let params = [];

    if (timeframe === 'month') {
      // Monthly points earned from transactions in the current month
      sql = `
        SELECT u.id, u.name, u.avatar_url,
               COALESCE(SUM(t.points), 0) as green_points,
               COUNT(t.id) as activity_count
        FROM users u
        JOIN green_point_transactions t ON u.id = t.user_id
        WHERE u.role = 'citizen'
          AND t.created_at >= DATE_TRUNC('month', CURRENT_TIMESTAMP)
        GROUP BY u.id, u.name, u.avatar_url
        ORDER BY green_points DESC
        LIMIT 25;
      `;
    } else {
      // Overall leaderboard
      sql = `
        SELECT u.id, u.name, u.avatar_url, u.green_points,
               (SELECT COUNT(*) FROM green_point_transactions t WHERE t.user_id = u.id) as activity_count
        FROM users u
        WHERE u.role = 'citizen'
        ORDER BY u.green_points DESC, u.id ASC
        LIMIT 25;
      `;
    }

    let result;
    try {
      result = await query(sql, params);
    } catch (e) {
      // Fallback for SQLite date trunc if on sqlite
      const fallbackSql = `
        SELECT u.id, u.name, u.avatar_url, u.green_points,
               (SELECT COUNT(*) FROM green_point_transactions t WHERE t.user_id = u.id) as activity_count
        FROM users u
        WHERE u.role = 'citizen'
        ORDER BY u.green_points DESC
        LIMIT 25;
      `;
      result = await query(fallbackSql, []);
    }

    // Add rankings
    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name,
      avatar_url: row.avatar_url,
      green_points: parseInt(row.green_points || 0, 10),
      activity_count: parseInt(row.activity_count || 0, 10)
    }));

    res.json({
      success: true,
      timeframe,
      leaderboard
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leaderboard.' });
  }
}

/**
 * Get Configurable Point Rewards Scheme
 */
function getPointsRules(req, res) {
  const rules = [
    { activity: 'Register Account', points: 20, description: 'Welcome gift for joining Civic Impact' },
    { activity: 'Submit Civic Complaint', points: 10, description: 'Report civic issues with photos and location' },
    { activity: 'Complaint Resolved', points: 25, description: 'Bonus when your reported issue gets solved' },
    { activity: 'Waste Pickup Completed', points: 20, description: 'Doorstep segregation and handover' },
    { activity: 'Donate Item', points: 30, description: 'Give usable clothes, books, and goods to someone in need' },
    { activity: 'Give Away Item', points: 20, description: 'Free distribution of household items' },
    { activity: 'Reuse Item', points: 15, description: 'Take or re-home an item instead of buying new' },
    { activity: 'Complete Educational Quiz', points: 15, description: 'Pass the waste segregation knowledge test' }
  ];

  res.json({
    success: true,
    rules
  });
}

module.exports = {
  getMyPoints,
  getLeaderboard,
  getPointsRules
};
