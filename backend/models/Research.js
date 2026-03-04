const mongoose = require('mongoose');

const ResearchSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  type:        { type: String, enum: ['fundamental', 'technical', 'macro', 'sector', 'custom'], required: true },
  symbol:      { type: String },
  exchange:    { type: String },
  aiSummary:   { type: String },
  content:     { type: String },
  keyMetrics:  { type: mongoose.Schema.Types.Mixed },
  sentiment:   { type: String, enum: ['bullish', 'bearish', 'neutral'] },
  recommendation: { type: String, enum: ['buy', 'sell', 'hold', 'watch'] },
  targetPrice: { type: Number },
  tags:        [String],
  isPublic:    { type: Boolean, default: false },
  sourceFile:  { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Research', ResearchSchema);
