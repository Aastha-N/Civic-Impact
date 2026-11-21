const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, notificationController.getNotifications);
router.patch('/:id/read', requireAuth, notificationController.markAsRead);
router.patch('/read-all', requireAuth, notificationController.markAllAsRead);

module.exports = router;
