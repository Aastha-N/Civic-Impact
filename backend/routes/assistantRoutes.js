const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');

// Public access for citizens and guests
router.post('/ask', assistantController.askAssistant);
router.get('/suggestions', assistantController.getQuickSuggestions);

module.exports = router;
