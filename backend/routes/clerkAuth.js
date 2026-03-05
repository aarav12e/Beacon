const express = require('express');
const router = express.Router();
const { protect, syncHandler } = require('../controllers/clerkSyncController');

// POST /api/auth/clerk-sync — called after Clerk sign-in to sync user to MongoDB
router.post('/clerk-sync', protect, syncHandler);

module.exports = router;
