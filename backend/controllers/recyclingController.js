const { query } = require('../config/db');

/**
 * Get Recycling Centres (with Material & Location Search)
 */
async function getRecyclingCentres(req, res) {
  try {
    const { material, search } = req.query;

    let sql = `SELECT * FROM recycling_centres WHERE 1=1`;
    const params = [];

    if (material && material !== 'All') {
      params.push(`%${material.trim().toLowerCase()}%`);
      sql += ` AND LOWER(accepted_materials) LIKE $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(address) LIKE $${params.length} OR LOWER(accepted_materials) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`;
    }

    sql += ` ORDER BY name ASC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      centres: result.rows
    });
  } catch (error) {
    console.error('Get recycling centres error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching recycling centres.' });
  }
}

/**
 * Get Single Recycling Centre
 */
async function getRecyclingCentreById(req, res) {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM recycling_centres WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Recycling centre not found.' });
    }

    res.json({
      success: true,
      centre: result.rows[0]
    });
  } catch (error) {
    console.error('Get centre error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching centre.' });
  }
}

/**
 * Create Recycling Centre (Admin Only)
 */
async function createRecyclingCentre(req, res) {
  try {
    const { name, address, location_lat, location_lng, accepted_materials, contact_phone, contact_email, opening_hours, description } = req.body;

    if (!name || !address || !accepted_materials) {
      return res.status(400).json({ success: false, message: 'Name, address, and accepted materials are required.' });
    }

    const insertSql = `
      INSERT INTO recycling_centres (
        name, address, location_lat, location_lng, accepted_materials,
        contact_phone, contact_email, opening_hours, description, is_sample, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      name.trim(),
      address.trim(),
      location_lat ? parseFloat(location_lat) : null,
      location_lng ? parseFloat(location_lng) : null,
      accepted_materials.trim(),
      contact_phone ? contact_phone.trim() : null,
      contact_email ? contact_email.trim() : null,
      opening_hours ? opening_hours.trim() : 'Mon-Sat: 9:00 AM - 6:00 PM',
      description ? description.trim() : null
    ]);

    res.status(201).json({
      success: true,
      message: 'Recycling centre added successfully!',
      centre: result.rows[0]
    });
  } catch (error) {
    console.error('Create centre error:', error);
    res.status(500).json({ success: false, message: 'Server error adding centre.' });
  }
}

/**
 * Update Recycling Centre (Admin Only)
 */
async function updateRecyclingCentre(req, res) {
  try {
    const { id } = req.params;
    const { name, address, location_lat, location_lng, accepted_materials, contact_phone, contact_email, opening_hours, description } = req.body;

    const updateSql = `
      UPDATE recycling_centres
      SET name = COALESCE($1, name),
          address = COALESCE($2, address),
          location_lat = COALESCE($3, location_lat),
          location_lng = COALESCE($4, location_lng),
          accepted_materials = COALESCE($5, accepted_materials),
          contact_phone = COALESCE($6, contact_phone),
          contact_email = COALESCE($7, contact_email),
          opening_hours = COALESCE($8, opening_hours),
          description = COALESCE($9, description)
      WHERE id = $10
      RETURNING *;
    `;

    const result = await query(updateSql, [
      name ? name.trim() : null,
      address ? address.trim() : null,
      location_lat ? parseFloat(location_lat) : null,
      location_lng ? parseFloat(location_lng) : null,
      accepted_materials ? accepted_materials.trim() : null,
      contact_phone ? contact_phone.trim() : null,
      contact_email ? contact_email.trim() : null,
      opening_hours ? opening_hours.trim() : null,
      description ? description.trim() : null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Recycling centre not found.' });
    }

    res.json({
      success: true,
      message: 'Recycling centre updated successfully.',
      centre: result.rows[0]
    });
  } catch (error) {
    console.error('Update centre error:', error);
    res.status(500).json({ success: false, message: 'Server error updating centre.' });
  }
}

/**
 * Delete Recycling Centre (Admin Only)
 */
async function deleteRecyclingCentre(req, res) {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM recycling_centres WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Recycling centre not found.' });
    }

    res.json({
      success: true,
      message: 'Recycling centre deleted successfully.'
    });
  } catch (error) {
    console.error('Delete centre error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting centre.' });
  }
}

module.exports = {
  getRecyclingCentres,
  getRecyclingCentreById,
  createRecyclingCentre,
  updateRecyclingCentre,
  deleteRecyclingCentre
};
