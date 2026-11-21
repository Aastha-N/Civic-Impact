const { analyzeItem, KNOWLEDGE_BASE } = require('../services/assistantEngine');

/**
 * Handle "What Should I Do?" query
 */
async function askAssistant(req, res) {
  try {
    const { query: userQuery } = req.body;

    if (!userQuery || !userQuery.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an item description or waste inquiry.'
      });
    }

    const guidance = analyzeItem(userQuery);

    res.json({
      success: true,
      guidance
    });
  } catch (error) {
    console.error('Smart assistant error:', error);
    res.status(500).json({ success: false, message: 'Server error processing assistant inquiry.' });
  }
}

/**
 * Get popular/quick suggestion questions
 */
function getQuickSuggestions(req, res) {
  const suggestions = [
    { label: 'Old clothes & jackets', query: 'I have old clothes that are still usable' },
    { label: 'Kitchen vegetable peels', query: 'I have vegetable peels and leftover food' },
    { label: 'Old broken smartphone', query: 'I have an old mobile phone with dead battery' },
    { label: 'Cardboard delivery boxes', query: 'I have excess corrugated cardboard boxes' },
    { label: 'Wooden study desk', query: 'I want to get rid of a wooden study desk' },
    { label: 'Expired antibiotics & medicines', query: 'Where to dispose of expired medicines safely?' },
    { label: 'Household paint cans', query: 'Leftover wall paint cans and varnish' }
  ];

  res.json({
    success: true,
    suggestions
  });
}

module.exports = {
  askAssistant,
  getQuickSuggestions
};
