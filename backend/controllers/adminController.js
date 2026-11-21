const { query, getDbType } = require('../config/db');

/**
 * Get Platform-Wide Analytics & KPI Metrics
 */
async function getDashboardStats(req, res) {
  try {
    // Users stats
    const totalUsersRes = await query('SELECT COUNT(*) as count FROM users');
    const roleStatsRes = await query('SELECT role, COUNT(*) as count FROM users GROUP BY role');

    // Complaints stats
    const totalComplaintsRes = await query('SELECT COUNT(*) as count FROM complaints');
    const pendingComplaintsRes = await query(
      "SELECT COUNT(*) as count FROM complaints WHERE status IN ('Submitted', 'Under Review', 'Assigned', 'In Progress')"
    );
    const resolvedComplaintsRes = await query(
      "SELECT COUNT(*) as count FROM complaints WHERE status IN ('Resolved', 'Closed')"
    );
    const categoryStatsRes = await query('SELECT category, COUNT(*) as count FROM complaints GROUP BY category');
    const priorityStatsRes = await query('SELECT priority, COUNT(*) as count FROM complaints GROUP BY priority');

    // Pickups stats
    const totalPickupsRes = await query('SELECT COUNT(*) as count FROM waste_pickup_requests');
    const pendingPickupsRes = await query(
      "SELECT COUNT(*) as count FROM waste_pickup_requests WHERE status IN ('Requested', 'Scheduled', 'Assigned')"
    );
    const completedPickupsRes = await query(
      "SELECT COUNT(*) as count FROM waste_pickup_requests WHERE status = 'Completed'"
    );

    // Reuse listings stats
    const totalListingsRes = await query('SELECT COUNT(*) as count FROM reuse_listings');
    const activeListingsRes = await query(
      "SELECT COUNT(*) as count FROM reuse_listings WHERE availability_status = 'Available'"
    );

    // Green Points awarded
    const totalPointsRes = await query('SELECT COALESCE(SUM(points), 0) as total FROM green_point_transactions');

    // Recycling centres
    const centresRes = await query('SELECT COUNT(*) as count FROM recycling_centres');

    res.json({
      success: true,
      databaseType: getDbType(),
      stats: {
        users: {
          total: parseInt(totalUsersRes.rows[0]?.count || 0, 10),
          roles: roleStatsRes.rows
        },
        complaints: {
          total: parseInt(totalComplaintsRes.rows[0]?.count || 0, 10),
          pending: parseInt(pendingComplaintsRes.rows[0]?.count || 0, 10),
          resolved: parseInt(resolvedComplaintsRes.rows[0]?.count || 0, 10),
          byCategory: categoryStatsRes.rows,
          byPriority: priorityStatsRes.rows
        },
        pickups: {
          total: parseInt(totalPickupsRes.rows[0]?.count || 0, 10),
          pending: parseInt(pendingPickupsRes.rows[0]?.count || 0, 10),
          completed: parseInt(completedPickupsRes.rows[0]?.count || 0, 10)
        },
        listings: {
          total: parseInt(totalListingsRes.rows[0]?.count || 0, 10),
          active: parseInt(activeListingsRes.rows[0]?.count || 0, 10)
        },
        greenPointsAwarded: parseInt(totalPointsRes.rows[0]?.total || 0, 10),
        recyclingCentresCount: parseInt(centresRes.rows[0]?.count || 0, 10)
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Server error calculating dashboard stats.' });
  }
}

/**
 * Manage Users (List, Filter, Search)
 */
async function getUsers(req, res) {
  try {
    const { role, search } = req.query;

    let sql = `
      SELECT id, name, email, phone, address, role, green_points, created_at,
             (SELECT COUNT(*) FROM complaints WHERE user_id = users.id) as complaints_count,
             (SELECT COUNT(*) FROM reuse_listings WHERE user_id = users.id) as listings_count
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (role && role !== 'All') {
      params.push(role);
      sql += ` AND role = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(phone) LIKE $${params.length} OR LOWER(address) LIKE $${params.length})`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user directory.' });
  }
}

/**
 * Update User Role (Admin only)
 */
async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ['citizen', 'service_team', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: `Invalid role. Allowed: ${allowedRoles.join(', ')}` });
    }

    // Prevent removing last admin
    if (parseInt(id, 10) === req.user.id && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot demote yourself from admin role.' });
    }

    const result = await query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: `User ${result.rows[0].name} role updated to '${role}'.`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Server error updating user role.' });
  }
}

/**
 * Get Service Team Members List (for assignment dropdowns)
 */
async function getServiceTeamMembers(req, res) {
  try {
    const result = await query(
      "SELECT id, name, email, phone, role FROM users WHERE role = 'service_team' ORDER BY name ASC"
    );

    res.json({
      success: true,
      members: result.rows
    });
  } catch (error) {
    console.error('Get service team error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching service team members.' });
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserRole,
  getServiceTeamMembers
};
