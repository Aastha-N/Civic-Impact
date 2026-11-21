const { query } = require('../config/db');
const { awardGreenPoints } = require('../services/notificationService');

/**
 * Get Educational Content (Optional category filter & keyword search)
 */
async function getEducationContent(req, res) {
  try {
    const { category, search } = req.query;

    let sql = 'SELECT * FROM educational_content WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(examples) LIKE $${params.length} OR LOWER(disposal_action) LIKE $${params.length})`;
    }

    sql += ' ORDER BY id ASC';

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      topics: result.rows
    });
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching educational content.' });
  }
}

/**
 * Complete Educational Activity / Quiz for Green Points
 */
async function completeQuiz(req, res) {
  try {
    const userId = req.user.id;
    const { topicId, quizScore = 100 } = req.body;

    // Check if user already took quiz recently (limit to 1 reward per day or per topic)
    const existing = await query(
      "SELECT id FROM green_point_transactions WHERE user_id = $1 AND activity_type = 'Education Completed' AND reference_id = $2",
      [userId, String(topicId || 'general')]
    );

    if (existing.rows.length > 0) {
      return res.json({
        success: true,
        message: 'Quiz completed! You have already claimed Green Points for this topic.',
        pointsAwarded: 0
      });
    }

    await awardGreenPoints({
      userId,
      points: 15,
      activityType: 'Education Completed',
      description: 'Completed Waste Segregation Quiz with distinction',
      referenceId: String(topicId || 'general')
    });

    res.json({
      success: true,
      message: 'Congratulations! You earned +15 Green Points for completing the waste segregation quiz!',
      pointsAwarded: 15
    });
  } catch (error) {
    console.error('Complete quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error completing quiz.' });
  }
}

/**
 * Create Educational Topic (Admin)
 */
async function createTopic(req, res) {
  try {
    const { title, category, description, examples, disposal_action, icon } = req.body;

    if (!title || !category || !description || !disposal_action) {
      return res.status(400).json({ success: false, message: 'Title, category, description, and disposal action are required.' });
    }

    const insertSql = `
      INSERT INTO educational_content (title, category, description, examples, disposal_action, icon, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      title.trim(),
      category.trim(),
      description.trim(),
      examples ? examples.trim() : '',
      disposal_action.trim(),
      icon || 'Recycle'
    ]);

    res.status(201).json({
      success: true,
      message: 'Educational topic added successfully.',
      topic: result.rows[0]
    });
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({ success: false, message: 'Server error adding educational topic.' });
  }
}

/**
 * Update Topic (Admin)
 */
async function updateTopic(req, res) {
  try {
    const { id } = req.params;
    const { title, category, description, examples, disposal_action, icon } = req.body;

    const updateSql = `
      UPDATE educational_content
      SET title = COALESCE($1, title),
          category = COALESCE($2, category),
          description = COALESCE($3, description),
          examples = COALESCE($4, examples),
          disposal_action = COALESCE($5, disposal_action),
          icon = COALESCE($6, icon)
      WHERE id = $7
      RETURNING *;
    `;

    const result = await query(updateSql, [
      title ? title.trim() : null,
      category ? category.trim() : null,
      description ? description.trim() : null,
      examples ? examples.trim() : null,
      disposal_action ? disposal_action.trim() : null,
      icon || null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Educational topic not found.' });
    }

    res.json({
      success: true,
      message: 'Educational topic updated successfully.',
      topic: result.rows[0]
    });
  } catch (error) {
    console.error('Update topic error:', error);
    res.status(500).json({ success: false, message: 'Server error updating educational topic.' });
  }
}

/**
 * Delete Topic (Admin)
 */
async function deleteTopic(req, res) {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM educational_content WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Educational topic not found.' });
    }

    res.json({
      success: true,
      message: 'Topic deleted successfully.'
    });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting topic.' });
  }
}

module.exports = {
  getEducationContent,
  completeQuiz,
  createTopic,
  updateTopic,
  deleteTopic
};
