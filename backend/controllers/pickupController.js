const { query } = require('../config/db');
const { awardGreenPoints, createNotification } = require('../services/notificationService');

/**
 * Generate unique Pickup ID: WPK-2026-XXXX
 */
function generatePickupId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `WPK-${year}-${randomNum}`;
}

/**
 * Create Waste Pickup Request (Citizen)
 */
async function createPickupRequest(req, res) {
  try {
    const {
      waste_type,
      description,
      quantity,
      pickup_address,
      preferred_date,
      preferred_time,
      instructions,
      location_lat,
      location_lng
    } = req.body;
    const userId = req.user.id;

    if (!waste_type || !description || !quantity || !pickup_address || !preferred_date || !preferred_time) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Waste Type, Description, Quantity, Address, Date, Time).'
      });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photo_url || null;
    const pickupId = generatePickupId();

    const insertSql = `
      INSERT INTO waste_pickup_requests (
        pickup_id, user_id, waste_type, description, quantity,
        pickup_address, location_lat, location_lng,
        preferred_date, preferred_time, photo_url, instructions,
        status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Requested', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      pickupId,
      userId,
      waste_type,
      description.trim(),
      quantity,
      pickup_address.trim(),
      location_lat ? parseFloat(location_lat) : null,
      location_lng ? parseFloat(location_lng) : null,
      preferred_date,
      preferred_time,
      photoUrl,
      instructions ? instructions.trim() : null
    ]);

    const pickup = result.rows[0];

    // In-app notification
    await createNotification({
      userId,
      title: 'Waste Pickup Requested',
      message: `Your pickup request #${pickup.pickup_id} for ${waste_type} on ${preferred_date} has been placed.`,
      type: 'pickup',
      referenceId: pickup.pickup_id
    });

    res.status(201).json({
      success: true,
      message: 'Waste pickup request submitted successfully!',
      pickup
    });
  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({ success: false, message: 'Server error creating pickup request: ' + error.message });
  }
}

/**
 * Get Pickup Requests (Filtered by role: Citizen sees theirs, Service Team sees assigned, Admin sees all)
 */
async function getPickupRequests(req, res) {
  try {
    const { status, waste_type, search, myOnly } = req.query;
    const user = req.user;

    let sql = `
      SELECT p.*, u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
             s.name as assigned_to_name, s.phone as assigned_to_phone
      FROM waste_pickup_requests p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN users s ON p.assigned_to_user_id = s.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by role
    if (myOnly === 'true' || (user && user.role === 'citizen' && myOnly !== 'false')) {
      params.push(user.id);
      sql += ` AND p.user_id = $${params.length}`;
    }

    if (user && user.role === 'service_team') {
      params.push(user.id);
      sql += ` AND p.assigned_to_user_id = $${params.length}`;
    }

    if (status && status !== 'All') {
      params.push(status);
      sql += ` AND p.status = $${params.length}`;
    }

    if (waste_type && waste_type !== 'All') {
      params.push(waste_type);
      sql += ` AND p.waste_type = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(p.pickup_id) LIKE $${params.length} OR LOWER(p.description) LIKE $${params.length} OR LOWER(p.pickup_address) LIKE $${params.length})`;
    }

    sql += ` ORDER BY p.created_at DESC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      pickups: result.rows
    });
  } catch (error) {
    console.error('Get pickups error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching pickup requests.' });
  }
}

/**
 * Get Pickup by ID
 */
async function getPickupById(req, res) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT p.*, u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
             s.name as assigned_to_name, s.phone as assigned_to_phone
      FROM waste_pickup_requests p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN users s ON p.assigned_to_user_id = s.id
      WHERE p.id = $1 OR p.pickup_id = $1
    `;
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pickup request not found.' });
    }

    res.json({
      success: true,
      pickup: result.rows[0]
    });
  } catch (error) {
    console.error('Get pickup details error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching pickup details.' });
  }
}

/**
 * Schedule & Assign Pickup (Admin)
 */
async function scheduleAndAssignPickup(req, res) {
  try {
    const { id } = req.params;
    const { scheduled_date, scheduled_time, assigned_to_user_id, notes } = req.body;

    const existing = await query('SELECT * FROM waste_pickup_requests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pickup request not found.' });
    }
    const current = existing.rows[0];

    let newStatus = current.status;
    if (scheduled_date && assigned_to_user_id) {
      newStatus = 'Assigned';
    } else if (scheduled_date) {
      newStatus = 'Scheduled';
    }

    const updateSql = `
      UPDATE waste_pickup_requests
      SET scheduled_date = COALESCE($1, scheduled_date),
          scheduled_time = COALESCE($2, scheduled_time),
          assigned_to_user_id = COALESCE($3, assigned_to_user_id),
          notes = COALESCE($4, notes),
          status = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
    `;

    const result = await query(updateSql, [
      scheduled_date || null,
      scheduled_time || null,
      assigned_to_user_id || null,
      notes || null,
      newStatus,
      id
    ]);

    const updated = result.rows[0];

    // Notify citizen
    await createNotification({
      userId: current.user_id,
      title: `Waste Pickup #${current.pickup_id} Scheduled`,
      message: `Your waste pickup has been scheduled for ${scheduled_date || current.preferred_date} (${scheduled_time || current.preferred_time}).`,
      type: 'pickup',
      referenceId: current.pickup_id
    });

    // Notify service team member if assigned
    if (assigned_to_user_id) {
      await createNotification({
        userId: assigned_to_user_id,
        title: 'New Waste Pickup Assigned',
        message: `You are assigned to collect ${current.waste_type} at ${current.pickup_address} on ${scheduled_date || current.preferred_date}.`,
        type: 'pickup',
        referenceId: current.pickup_id
      });
    }

    res.json({
      success: true,
      message: 'Pickup request successfully updated.',
      pickup: updated
    });
  } catch (error) {
    console.error('Schedule pickup error:', error);
    res.status(500).json({ success: false, message: 'Server error scheduling pickup.' });
  }
}

/**
 * Update Pickup Status (Service Team or Admin)
 */
async function updatePickupStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const user = req.user;

    const allowedStatuses = ['Requested', 'Scheduled', 'Assigned', 'Picked Up', 'Completed'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowedStatuses.join(', ')}` });
    }

    const existing = await query('SELECT * FROM waste_pickup_requests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pickup request not found.' });
    }
    const current = existing.rows[0];

    if (user.role === 'service_team' && current.assigned_to_user_id !== user.id) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this pickup request.' });
    }

    const updateSql = `
      UPDATE waste_pickup_requests
      SET status = $1,
          notes = COALESCE($2, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const result = await query(updateSql, [status, notes || null, id]);
    const updated = result.rows[0];

    // If Completed, award Green Points (+20)
    if (status === 'Completed' && current.status !== 'Completed') {
      await awardGreenPoints({
        userId: current.user_id,
        points: 20,
        activityType: 'Waste Pickup Completed',
        description: `Responsible pickup of ${current.waste_type} (${current.quantity})`,
        referenceId: current.pickup_id
      });
    }

    // Notify citizen
    await createNotification({
      userId: current.user_id,
      title: `Waste Pickup #${current.pickup_id} Status: ${status}`,
      message: `Your pickup request has updated to '${status}'. ${notes ? `Notes: ${notes}` : ''}`,
      type: 'pickup',
      referenceId: current.pickup_id
    });

    res.json({
      success: true,
      message: `Pickup status updated to ${status}.`,
      pickup: updated
    });
  } catch (error) {
    console.error('Update pickup status error:', error);
    res.status(500).json({ success: false, message: 'Server error updating pickup status.' });
  }
}

module.exports = {
  createPickupRequest,
  getPickupRequests,
  getPickupById,
  scheduleAndAssignPickup,
  updatePickupStatus
};
