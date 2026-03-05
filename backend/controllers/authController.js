/**
 * Auth Controller
 * Clerk manages sign-in/sign-up. These handlers only deal with
 * profile management on our MongoDB user records.
 */
const User = require('../models/User');

// @route GET /api/auth/me
// @access Private (Clerk token)
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @route PUT /api/auth/profile
// @access Private (Clerk token)
exports.updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, preferences } },
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
