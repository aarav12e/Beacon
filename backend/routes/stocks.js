const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getQuote, searchStocks, getMarketSummary, getHistory, getTopMovers } = require('../controllers/stockController');

router.get('/market-summary', getMarketSummary);
router.get('/movers', getTopMovers);
router.get('/search', protect, searchStocks);
router.get('/history/:symbol', protect, getHistory);
router.get('/quote/:symbol', protect, getQuote);

module.exports = router;
