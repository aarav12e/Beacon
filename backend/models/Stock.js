const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  symbol:      { type: String, required: true, uppercase: true },
  exchange:    { type: String, enum: ['NSE', 'BSE', 'NYSE', 'NASDAQ', 'MCX'], required: true },
  name:        { type: String, required: true },
  sector:      { type: String },
  industry:    { type: String },
  marketCap:   { type: Number },
  price:       { type: Number },
  change:      { type: Number },
  changePct:   { type: Number },
  volume:      { type: Number },
  high52w:     { type: Number },
  low52w:      { type: Number },
  pe:          { type: Number },
  eps:         { type: Number },
  dividend:    { type: Number },
  beta:        { type: Number },
  priceHistory:[{
    date:  Date,
    open:  Number,
    high:  Number,
    low:   Number,
    close: Number,
    volume:Number,
  }],
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

StockSchema.index({ symbol: 1, exchange: 1 }, { unique: true });

module.exports = mongoose.model('Stock', StockSchema);
