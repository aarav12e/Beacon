/**
 * Backend auth middleware — verifies Clerk session tokens.
 * Clerk tokens are short-lived JWTs signed by Clerk's RS256 key.
 * We use @clerk/clerk-sdk-node to verify them.
 */
const { createClerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized — no token' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the Clerk session token
    const payload = await clerkClient.verifyToken(token);
    const clerkId = payload.sub; // Clerk user ID

    // Find or lazily create the MongoDB user
    let user = await User.findOne({ clerkId });
    if (!user) {
      // Try matching by email if clerkId not yet stored
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          user.clerkId = clerkId;
          await user.save();
        }
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found — please sign in again' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ error: 'Not authorized — invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { protect, adminOnly };
