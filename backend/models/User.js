const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },   // optional — Clerk manages auth
  role: { type: String, enum: ['analyst', 'trader', 'admin'], default: 'analyst' },
  avatar: { type: String, default: '' },
  preferences: {
    theme: { type: String, default: 'dark' },
    defaultView: { type: String, default: 'dashboard' },
    watchlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Watchlist' }],
  },
  subscription: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
