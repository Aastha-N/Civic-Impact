const express = require('express');
const router = express.Router();
const recyclingController = require('../controllers/recyclingController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public access
router.get('/', recyclingController.getRecyclingCentres);
router.get('/:id', recyclingController.getRecyclingCentreById);

// Admin-only management
router.post('/', requireAuth, authorizeRoles('admin'), recyclingController.createRecyclingCentre);
router.put('/:id', requireAuth, authorizeRoles('admin'), recyclingController.updateRecyclingCentre);
router.delete('/:id', requireAuth, authorizeRoles('admin'), recyclingController.deleteRecyclingCentre);

module.exports = router;
