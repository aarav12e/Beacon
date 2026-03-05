/**
 * Auth Routes — /api/auth
 *
 * Clerk handles sign-in/sign-up on the frontend.
 * These routes:
 *   POST /clerk-sync   — syncs a Clerk user to MongoDB (called after sign-in)
 *   GET  /me           — returns the current user profile
 *   PUT  /profile      — updates name / preferences
 */
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { getMe, updateProfile } = require('../controllers/authController');
const { syncHandler, protect: clerkProtect } = require('../controllers/clerkSyncController');

// Clerk user sync (uses its own lightweight protect from clerkSyncController)
router.post('/clerk-sync', clerkProtect, syncHandler);

// Protected profile routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
