const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public educational browsing
router.get('/', educationController.getEducationContent);

// Claim Green Points for completing quiz / educational guide
router.post('/quiz', requireAuth, educationController.completeQuiz);

// Admin content management
router.post('/', requireAuth, authorizeRoles('admin'), educationController.createTopic);
router.put('/:id', requireAuth, authorizeRoles('admin'), educationController.updateTopic);
router.delete('/:id', requireAuth, authorizeRoles('admin'), educationController.deleteTopic);

module.exports = router;
