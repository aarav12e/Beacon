const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:   { type: String, required: true, default: 'My Watchlist' },
  stocks: [{
    symbol:   String,
    exchange: String,
    addedAt:  { type: Date, default: Date.now },
    notes:    String,
    alertPrice: Number,
  }],
  color:  { type: String, default: '#C8A84B' },
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);
