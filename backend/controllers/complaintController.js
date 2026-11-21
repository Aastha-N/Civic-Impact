const { query } = require('../config/db');
const { calculatePriority } = require('../services/priorityEngine');
const { awardGreenPoints, createNotification } = require('../services/notificationService');

/**
 * Generate unique complaint ID: CMP-2026-XXXX
 */
function generateComplaintId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `CMP-${year}-${randomNum}`;
}

/**
 * Create Complaint (Citizens & Users)
 */
async function createComplaint(req, res) {
  try {
    const { title, description, category, address, location_lat, location_lng } = req.body;
    const userId = req.user.id;

    if (!title || !description || !category || !address) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and address are required.'
      });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photo_url || null;

    // Smart Rule-Based Priority calculation
    const priorityCalc = calculatePriority({ category, title, description, address });
    const complaintId = generateComplaintId();

    const insertSql = `
      INSERT INTO complaints (
        complaint_id, user_id, title, description, category,
        photo_url, location_lat, location_lng, address,
        priority, priority_reason, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Submitted', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      complaintId,
      userId,
      title.trim(),
      description.trim(),
      category,
      photoUrl,
      location_lat ? parseFloat(location_lat) : null,
      location_lng ? parseFloat(location_lng) : null,
      address.trim(),
      priorityCalc.priority,
      priorityCalc.priorityReason
    ]);

    const complaint = result.rows[0];

    // Initial timeline entry in complaint_updates
    await query(
      `INSERT INTO complaint_updates (complaint_id, user_id, status_from, status_to, note, created_at)
       VALUES ($1, $2, NULL, 'Submitted', 'Complaint submitted by citizen.', CURRENT_TIMESTAMP)`,
      [complaint.id, userId]
    );

    // Award Green Points (+10)
    await awardGreenPoints({
      userId,
      points: 10,
      activityType: 'Civic Complaint Submission',
      description: `Reported issue: ${title.substring(0, 30)}...`,
      referenceId: complaint.complaint_id
    });

    // Notify user
    await createNotification({
      userId,
      title: 'Complaint Logged Successfully',
      message: `Your complaint #${complaint.complaint_id} (${category}) has been submitted and assigned ${priorityCalc.priority} priority.`,
      type: 'complaint',
      referenceId: complaint.complaint_id
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully!',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ success: false, message: 'Server error creating complaint: ' + error.message });
  }
}

/**
 * Get Complaints (with Search, Filter, Pagination)
 */
async function getComplaints(req, res) {
  try {
    const { search, category, status, priority, myOnly } = req.query;
    const user = req.user;

    let sql = `
      SELECT c.*, u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
             s.name as assigned_to_name
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users s ON c.assigned_to_user_id = s.id
      WHERE 1=1
    `;
    const params = [];

    // If citizen requested 'myOnly' or if citizen only wants to see their complaints
    if (myOnly === 'true' || (user && user.role === 'citizen' && myOnly !== 'false')) {
      params.push(user.id);
      sql += ` AND c.user_id = $${params.length}`;
    }

    // If service team member viewing their assignments
    if (user && user.role === 'service_team') {
      params.push(user.id);
      sql += ` AND c.assigned_to_user_id = $${params.length}`;
    }

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND c.category = $${params.length}`;
    }

    if (status && status !== 'All') {
      params.push(status);
      sql += ` AND c.status = $${params.length}`;
    }

    if (priority && priority !== 'All') {
      params.push(priority);
      sql += ` AND c.priority = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(c.title) LIKE $${params.length} OR LOWER(c.description) LIKE $${params.length} OR LOWER(c.complaint_id) LIKE $${params.length} OR LOWER(c.address) LIKE $${params.length})`;
    }

    sql += ` ORDER BY c.created_at DESC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      complaints: result.rows
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching complaints.' });
  }
}

/**
 * Get Complaint Details & Timeline
 */
async function getComplaintById(req, res) {
  try {
    const { id } = req.params;

    const compSql = `
      SELECT c.*, u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
             s.name as assigned_to_name, s.phone as assigned_to_phone
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users s ON c.assigned_to_user_id = s.id
      WHERE c.id = $1 OR c.complaint_id = $1
    `;
    const compRes = await query(compSql, [id]);

    if (compRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const complaint = compRes.rows[0];

    // Fetch timeline updates
    const updatesSql = `
      SELECT cu.*, u.name as updated_by_name, u.role as updated_by_role
      FROM complaint_updates cu
      LEFT JOIN users u ON cu.user_id = u.id
      WHERE cu.complaint_id = $1
      ORDER BY cu.created_at ASC
    `;
    const updatesRes = await query(updatesSql, [complaint.id]);

    res.json({
      success: true,
      complaint,
      timeline: updatesRes.rows
    });
  } catch (error) {
    console.error('Get complaint details error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching complaint details.' });
  }
}

/**
 * Update Complaint Status (Service Team or Admin)
 */
async function updateComplaintStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note, resolution_notes } = req.body;
    const user = req.user;

    const allowedStatuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    // Fetch existing
    const existing = await query('SELECT * FROM complaints WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }
    const current = existing.rows[0];

    // Service team can only update complaints assigned to them
    if (user.role === 'service_team' && current.assigned_to_user_id !== user.id) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this complaint.' });
    }

    const resolutionPhotoUrl = req.file ? `/uploads/${req.file.filename}` : current.resolution_photo_url;

    // Update complaint record
    const updateSql = `
      UPDATE complaints
      SET status = $1,
          resolution_notes = COALESCE($2, resolution_notes),
          resolution_photo_url = COALESCE($3, resolution_photo_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
    `;
    const updatedRes = await query(updateSql, [status, resolution_notes || null, resolutionPhotoUrl, id]);
    const updatedComplaint = updatedRes.rows[0];

    // Insert update history
    await query(
      `INSERT INTO complaint_updates (complaint_id, user_id, status_from, status_to, note, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [id, user.id, current.status, status, note || `Status changed from ${current.status} to ${status}`]
    );

    // If status became Resolved, award points to citizen (+25)
    if (status === 'Resolved' && current.status !== 'Resolved') {
      await awardGreenPoints({
        userId: current.user_id,
        points: 25,
        activityType: 'Complaint Resolution',
        description: `Your issue #${current.complaint_id} was successfully resolved!`,
        referenceId: current.complaint_id
      });
    }

    // Notify citizen
    await createNotification({
      userId: current.user_id,
      title: `Complaint #${current.complaint_id} Status: ${status}`,
      message: `Your reported civic issue has progressed to '${status}'. ${note ? `Note: ${note}` : ''}`,
      type: 'complaint',
      referenceId: current.complaint_id
    });

    res.json({
      success: true,
      message: `Complaint status updated to ${status}.`,
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ success: false, message: 'Server error updating complaint: ' + error.message });
  }
}

/**
 * Assign Complaint to Service Team (Admin Only)
 */
async function assignComplaint(req, res) {
  try {
    const { id } = req.params;
    const { serviceTeamUserId, note } = req.body;

    if (!serviceTeamUserId) {
      return res.status(400).json({ success: false, message: 'Service team user ID is required.' });
    }

    // Verify service team member
    const serviceUser = await query("SELECT id, name, role FROM users WHERE id = $1 AND role = 'service_team'", [serviceTeamUserId]);
    if (serviceUser.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Selected user is not a valid Service Team personnel.' });
    }

    const compRes = await query('SELECT * FROM complaints WHERE id = $1', [id]);
    if (compRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }
    const current = compRes.rows[0];

    const updateSql = `
      UPDATE complaints
      SET assigned_to_user_id = $1,
          status = CASE WHEN status = 'Submitted' OR status = 'Under Review' THEN 'Assigned' ELSE status END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const updatedRes = await query(updateSql, [serviceTeamUserId, id]);
    const updated = updatedRes.rows[0];

    // Log update
    await query(
      `INSERT INTO complaint_updates (complaint_id, user_id, status_from, status_to, note, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [id, req.user.id, current.status, updated.status, `Assigned to ${serviceUser.rows[0].name}. ${note || ''}`]
    );

    // Notify service team member
    await createNotification({
      userId: serviceTeamUserId,
      title: 'New Complaint Assigned to You',
      message: `You have been assigned to handle complaint #${current.complaint_id} (${current.category}): "${current.title}".`,
      type: 'complaint',
      referenceId: current.complaint_id
    });

    // Notify citizen
    await createNotification({
      userId: current.user_id,
      title: `Complaint #${current.complaint_id} Assigned`,
      message: `Your complaint has been assigned to service team personnel (${serviceUser.rows[0].name}) for resolution.`,
      type: 'complaint',
      referenceId: current.complaint_id
    });

    res.json({
      success: true,
      message: `Complaint assigned to ${serviceUser.rows[0].name}.`,
      complaint: updated
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ success: false, message: 'Server error assigning complaint: ' + error.message });
  }
}

/**
 * Admin Override Priority
 */
async function overridePriority(req, res) {
  try {
    const { id } = req.params;
    const { priority, priorityReason } = req.body;

    const allowed = ['Low', 'Medium', 'High', 'Critical'];
    if (!priority || !allowed.includes(priority)) {
      return res.status(400).json({ success: false, message: `Priority must be one of: ${allowed.join(', ')}` });
    }

    const updateSql = `
      UPDATE complaints
      SET priority = $1,
          priority_reason = COALESCE($2, priority_reason),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const result = await query(updateSql, [priority, priorityReason || `Admin manual override to ${priority}`, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({
      success: true,
      message: `Priority updated to ${priority}.`,
      complaint: result.rows[0]
    });
  } catch (error) {
    console.error('Override priority error:', error);
    res.status(500).json({ success: false, message: 'Server error overriding priority.' });
  }
}

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  overridePriority
};
