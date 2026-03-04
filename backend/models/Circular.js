const mongoose = require('mongoose');

const CircularSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  body:         { type: String },
  aiSummary:    { type: String },
  source:       { type: String, enum: ['SEBI', 'RBI', 'MCA', 'IRDAI', 'NSE', 'BSE'], required: true },
  circularNo:   { type: String },
  category:     { type: String },
  publishedAt:  { type: Date, required: true },
  url:          { type: String },
  impactLevel:  { type: String, enum: ['high', 'medium', 'low'] },
  sectors:      [String],
  tags:         [String],
}, { timestamps: true });

CircularSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Circular', CircularSchema);
