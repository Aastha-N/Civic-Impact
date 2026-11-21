const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public or Authenticated browsing
router.get('/', optionalAuth, listingController.getListings);
router.get('/:id', optionalAuth, listingController.getListingById);

// Create item listing
router.post('/', requireAuth, upload.single('photo'), listingController.createListing);

// Request an item
router.post('/:id/request', requireAuth, listingController.requestItem);

// Owner accepts or rejects a request
router.patch('/:id/requests/:requestId', requireAuth, listingController.respondToRequest);

// Delete or moderate
router.delete('/:id', requireAuth, listingController.deleteListing);

module.exports = router;
