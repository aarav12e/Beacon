const XLSX = require('xlsx');
const Anthropic = require('@anthropic-ai/sdk');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.xlsx', '.xls', '.csv'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel (.xlsx, .xls) and CSV files allowed'));
    }
  }
}).single('file');

// @route POST /api/excel/analyze
exports.analyzeExcel = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetData = {};

      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        sheetData[sheetName] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      });

      // Convert to text for AI analysis
      let textContent = '';
      Object.entries(sheetData).forEach(([sheet, rows]) => {
        textContent += `\n=== Sheet: ${sheet} ===\n`;
        rows.slice(0, 100).forEach(row => {
          textContent += row.filter(Boolean).join(' | ') + '\n';
        });
      });

      // Get AI summary
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        messages: [{
          role: 'user',
          content: `You are a financial analyst. Analyze this Excel data and provide:

1. **Document Type** (P&L, Balance Sheet, Cash Flow, Portfolio, etc.)
2. **Company & Period** (if identifiable)
3. **Key Financial Metrics** (extract all important numbers)
4. **Trend Analysis** (if multi-period data)
5. **Financial Health Assessment**
6. **Notable Observations**
7. **Data Quality Issues** (missing data, inconsistencies)

Excel Data:
${textContent.substring(0, 8000)}`
        }],
      });

      res.json({
        filename: req.file.originalname,
        sheets: workbook.SheetNames,
        rowCounts: Object.fromEntries(
          Object.entries(sheetData).map(([k, v]) => [k, v.length])
        ),
        preview: Object.fromEntries(
          Object.entries(sheetData).map(([k, v]) => [k, v.slice(0, 5)])
        ),
        aiAnalysis: response.content[0].text,
      });

    } catch (parseErr) {
      res.status(500).json({ error: parseErr.message });
    }
  });
};

// @route POST /api/excel/formula-assist
exports.formulaAssist = async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question) return res.status(400).json({ error: 'Question required' });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: 'You are an Excel/financial modeling expert. Provide exact Excel formulas with explanations. Focus on financial modeling best practices.',
      messages: [{
        role: 'user',
        content: `${context ? `Sheet context: ${context}\n\n` : ''}Excel question: ${question}`
      }],
    });

    res.json({ answer: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
