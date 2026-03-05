/**
 * POST /api/auth/clerk-sync
 *
 * Called after Clerk sign-in to find or create a MongoDB user record.
 * The Clerk session token is already verified by the middleware.
 * Body: { clerkId, name, email }
 */
const { createClerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const payload = await clerkClient.verifyToken(token);
        req.clerkId = payload.sub;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const syncHandler = async (req, res) => {
    try {
        const { clerkId, name, email } = req.body;

        if (!clerkId || !email) {
            return res.status(400).json({ error: 'clerkId and email are required' });
        }

        // Try to find by clerkId first, then by email
        let user = await User.findOne({ clerkId });

        if (!user) {
            user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
                // Existing account — link to Clerk
                user.clerkId = clerkId;
                if (!user.name && name) user.name = name;
                await user.save();
            } else {
                // Brand new user — create minimal record
                user = await User.create({
                    clerkId,
                    name: name || 'Analyst',
                    email: email.toLowerCase(),
                    // No password — Clerk manages credentials
                });
            }
        }

        // Update lastLogin
        user.lastLogin = new Date();
        await user.save();

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription,
            },
        });
    } catch (err) {
        console.error('Clerk sync error:', err);
        res.status(500).json({ error: 'Failed to sync user' });
    }
};

module.exports = { protect, syncHandler };
