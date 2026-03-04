const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { analyzeExcel, formulaAssist } = require('../controllers/excelController');

router.post('/analyze', protect, analyzeExcel);
router.post('/formula-assist', protect, formulaAssist);

module.exports = router;
