const { query } = require('../config/db');
const { awardGreenPoints, createNotification } = require('../services/notificationService');

/**
 * Create Reuse / Donation Listing
 */
async function createListing(req, res) {
  try {
    const { title, description, category, listing_type, condition, location_address } = req.body;
    const userId = req.user.id;

    if (!title || !description || !category || !listing_type || !condition || !location_address) {
      return res.status(400).json({
        success: false,
        message: 'All fields (title, description, category, listing_type, condition, location_address) are required.'
      });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photo_url || null;

    const insertSql = `
      INSERT INTO reuse_listings (
        user_id, title, description, category, listing_type,
        condition, photo_url, location_address, availability_status,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Available', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      userId,
      title.trim(),
      description.trim(),
      category,
      listing_type,
      condition,
      photoUrl,
      location_address.trim()
    ]);

    const listing = result.rows[0];

    // Notification to user
    await createNotification({
      userId,
      title: 'Item Listed on Reuse Marketplace',
      message: `Your item "${listing.title}" is now visible to the community for ${listing.listing_type}.`,
      type: 'reuse',
      referenceId: listing.id
    });

    res.status(201).json({
      success: true,
      message: 'Item listed successfully!',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ success: false, message: 'Server error creating listing: ' + error.message });
  }
}

/**
 * Get Listings (with Search, Category, Type, Condition filters)
 */
async function getListings(req, res) {
  try {
    const { category, listing_type, condition, search, myOnly } = req.query;
    const user = req.user;

    let sql = `
      SELECT l.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
      FROM reuse_listings l
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (myOnly === 'true' && user) {
      params.push(user.id);
      sql += ` AND l.user_id = $${params.length}`;
    } else {
      // By default public marketplace shows Available and Requested items
      sql += ` AND l.availability_status IN ('Available', 'Requested')`;
    }

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND l.category = $${params.length}`;
    }

    if (listing_type && listing_type !== 'All') {
      params.push(listing_type);
      sql += ` AND l.listing_type = $${params.length}`;
    }

    if (condition && condition !== 'All') {
      params.push(condition);
      sql += ` AND l.condition = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(l.title) LIKE $${params.length} OR LOWER(l.description) LIKE $${params.length} OR LOWER(l.location_address) LIKE $${params.length})`;
    }

    sql += ` ORDER BY l.created_at DESC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      listings: result.rows
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching listings.' });
  }
}

/**
 * Get Listing Details and Requests
 */
async function getListingById(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    const listSql = `
      SELECT l.*, u.name as owner_name, u.phone as owner_phone
      FROM reuse_listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = $1
    `;
    const result = await query(listSql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    const listing = result.rows[0];

    // If viewer is the owner, fetch incoming item requests
    let requests = [];
    if (user && (user.id === listing.user_id || user.role === 'admin')) {
      const reqSql = `
        SELECT r.*, u.name as requester_name, u.email as requester_email, u.phone as requester_phone
        FROM item_requests r
        JOIN users u ON r.requester_id = u.id
        WHERE r.listing_id = $1
        ORDER BY r.created_at DESC
      `;
      const reqRes = await query(reqSql, [id]);
      requests = reqRes.rows;
    }

    // Check if the current logged-in user already requested this item
    let myRequest = null;
    if (user && user.id !== listing.user_id) {
      const myReqRes = await query(
        'SELECT * FROM item_requests WHERE listing_id = $1 AND requester_id = $2',
        [id, user.id]
      );
      if (myReqRes.rows.length > 0) {
        myRequest = myReqRes.rows[0];
      }
    }

    res.json({
      success: true,
      listing,
      requests,
      myRequest
    });
  } catch (error) {
    console.error('Get listing details error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching listing details.' });
  }
}

/**
 * Request an Item
 */
async function requestItem(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // Check listing
    const listingRes = await query('SELECT * FROM reuse_listings WHERE id = $1', [id]);
    if (listingRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    const listing = listingRes.rows[0];

    // User must not request their own listing
    if (listing.user_id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request your own listed item.'
      });
    }

    if (listing.availability_status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been re-homed and is no longer available.'
      });
    }

    // Check existing request
    const existingReq = await query(
      'SELECT id FROM item_requests WHERE listing_id = $1 AND requester_id = $2',
      [id, userId]
    );
    if (existingReq.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a request for this item.'
      });
    }

    // Create item request
    const insertSql = `
      INSERT INTO item_requests (listing_id, requester_id, message, status, created_at, updated_at)
      VALUES ($1, $2, $3, 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const result = await query(insertSql, [id, userId, message ? message.trim() : 'I am interested in this item.']);

    // Update listing status to Requested
    await query("UPDATE reuse_listings SET availability_status = 'Requested', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND availability_status = 'Available'", [id]);

    // Notify listing owner
    await createNotification({
      userId: listing.user_id,
      title: 'New Item Request Received! 🎁',
      message: `${req.user.name} sent a request for your item "${listing.title}".`,
      type: 'reuse',
      referenceId: listing.id
    });

    res.status(201).json({
      success: true,
      message: 'Request sent to the owner successfully!',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Request item error:', error);
    res.status(500).json({ success: false, message: 'Server error requesting item.' });
  }
}

/**
 * Accept or Reject Item Request (Owner Only)
 */
async function respondToRequest(req, res) {
  try {
    const { id, requestId } = req.params;
    const { status, response_note } = req.body;
    const userId = req.user.id;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be either 'Accepted' or 'Rejected'." });
    }

    // Check listing ownership
    const listRes = await query('SELECT * FROM reuse_listings WHERE id = $1', [id]);
    if (listRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }
    const listing = listRes.rows[0];

    if (listing.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the item owner can accept or reject requests.' });
    }

    // Fetch request
    const reqRes = await query('SELECT * FROM item_requests WHERE id = $1 AND listing_id = $2', [requestId, id]);
    if (reqRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item request not found.' });
    }
    const itemReq = reqRes.rows[0];

    // Update request
    const updateReqSql = `
      UPDATE item_requests
      SET status = $1, response_note = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const updatedRes = await query(updateReqSql, [status, response_note || null, requestId]);

    if (status === 'Accepted') {
      // Mark listing as Completed
      await query("UPDATE reuse_listings SET availability_status = 'Completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);

      // Reject all other pending requests for this item
      await query("UPDATE item_requests SET status = 'Rejected', response_note = 'Item given to another requester.', updated_at = CURRENT_TIMESTAMP WHERE listing_id = $1 AND id != $2 AND status = 'Pending'", [id, requestId]);

      // Award points to Owner (+30 for Donate, +20 for Give Away, +15 for Reuse)
      const points = listing.listing_type === 'Donate' ? 30 : listing.listing_type === 'Give Away' ? 20 : 15;
      await awardGreenPoints({
        userId: listing.user_id,
        points,
        activityType: `Item ${listing.listing_type}`,
        description: `Passed on item "${listing.title}" to a community member`,
        referenceId: listing.id
      });

      // Award points to Requester for Reusing (+10)
      await awardGreenPoints({
        userId: itemReq.requester_id,
        points: 10,
        activityType: 'Item Reuse / Adoption',
        description: `Acquired reusable item "${listing.title}" instead of buying new`,
        referenceId: listing.id
      });

      // Notify Requester
      await createNotification({
        userId: itemReq.requester_id,
        title: '🎉 Item Request Accepted!',
        message: `Your request for "${listing.title}" was accepted! Contact the owner (${req.user.name}: ${req.user.phone}) to arrange pickup.`,
        type: 'reuse',
        referenceId: listing.id
      });
    } else {
      // If rejected, check if there are other pending requests; if not, revert to Available
      const pendingRes = await query("SELECT id FROM item_requests WHERE listing_id = $1 AND id != $2 AND status = 'Pending'", [id, requestId]);
      if (pendingRes.rows.length === 0) {
        await query("UPDATE reuse_listings SET availability_status = 'Available', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
      }

      // Notify Requester of rejection
      await createNotification({
        userId: itemReq.requester_id,
        title: 'Item Request Status Update',
        message: `Your request for "${listing.title}" was not accepted. ${response_note ? `Note: ${response_note}` : ''}`,
        type: 'reuse',
        referenceId: listing.id
      });
    }

    res.json({
      success: true,
      message: `Request has been marked as ${status}.`,
      request: updatedRes.rows[0]
    });
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({ success: false, message: 'Server error responding to request.' });
  }
}

/**
 * Delete / Moderate Listing (Owner or Admin)
 */
async function deleteListing(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    const listRes = await query('SELECT * FROM reuse_listings WHERE id = $1', [id]);
    if (listRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    if (listRes.rows[0].user_id !== user.id && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this listing.' });
    }

    await query('DELETE FROM reuse_listings WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Listing removed successfully.'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting listing.' });
  }
}

module.exports = {
  createListing,
  getListings,
  getListingById,
  requestItem,
  respondToRequest,
  deleteListing
};
