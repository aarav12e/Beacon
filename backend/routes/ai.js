const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { chat, analyzeStock, summarizeFinancialStatement, summarizeCircular, macroOutlook } = require('../controllers/aiController');

router.post('/chat', protect, chat);
router.post('/analyze-stock', protect, analyzeStock);
router.post('/summarize-statement', protect, summarizeFinancialStatement);
router.post('/summarize-circular', protect, summarizeCircular);
router.post('/macro-outlook', protect, macroOutlook);

module.exports = router;
