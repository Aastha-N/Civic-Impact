const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public or Authenticated listing (citizens see their own, service team sees assigned, admin sees all)
router.get('/', requireAuth, complaintController.getComplaints);
router.get('/:id', requireAuth, complaintController.getComplaintById);

// Citizen creates complaint with optional photo
router.post('/', requireAuth, upload.single('photo'), complaintController.createComplaint);

// Service Team or Admin updates status/progress with optional resolution photo
router.patch(
  '/:id/status',
  requireAuth,
  authorizeRoles('service_team', 'admin'),
  upload.single('resolution_photo'),
  complaintController.updateComplaintStatus
);

// Admin-only assignment and priority override
router.patch('/:id/assign', requireAuth, authorizeRoles('admin'), complaintController.assignComplaint);
router.patch('/:id/priority', requireAuth, authorizeRoles('admin'), complaintController.overridePriority);

module.exports = router;
