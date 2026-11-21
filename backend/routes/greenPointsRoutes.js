const express = require('express');
const router = express.Router();
const greenPointsController = require('../controllers/greenPointsController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/my', requireAuth, greenPointsController.getMyPoints);
router.get('/leaderboard', greenPointsController.getLeaderboard);
router.get('/rules', greenPointsController.getPointsRules);

module.exports = router;
