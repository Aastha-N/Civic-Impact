const express = require('express');
const router = express.Router();
const pickupController = require('../controllers/pickupController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get requests
router.get('/', requireAuth, pickupController.getPickupRequests);
router.get('/:id', requireAuth, pickupController.getPickupById);

// Citizen creates waste pickup request
router.post('/', requireAuth, upload.single('photo'), pickupController.createPickupRequest);

// Admin schedule and assign service team
router.patch('/:id/schedule', requireAuth, authorizeRoles('admin'), pickupController.scheduleAndAssignPickup);

// Service Team or Admin updates status
router.patch('/:id/status', requireAuth, authorizeRoles('service_team', 'admin'), pickupController.updatePickupStatus);

module.exports = router;
