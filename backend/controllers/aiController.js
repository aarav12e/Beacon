const Anthropic = require('@anthropic-ai/sdk');
const Research = require('../models/Research');

const getClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Beacon AI, an expert financial analyst with deep expertise in:
- Indian equity markets (NSE, BSE), SEBI regulations, RBI monetary policy
- Fundamental analysis: DCF, EV/EBITDA, P/E, ROE, ROCE, debt ratios
- Technical analysis: RSI, MACD, Bollinger Bands, support/resistance, chart patterns
- Macro-economics and sector analysis
- Financial statement analysis (P&L, Balance Sheet, Cash Flow)

Always provide:
1. Clear, actionable insights backed by data
2. Risk warnings and disclaimers where appropriate
3. Both bullish and bearish perspectives
4. Specific metrics and numbers when available

Format responses with clear sections. Be concise but comprehensive.
Always end with: "⚠️ This is AI-generated analysis for informational purposes only. Not investment advice. Consult a SEBI-registered advisor."`;

// @route POST /api/ai/chat
exports.chat = async (req, res) => {
  try {
    const { message, history = [], context } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const client = getClient();

    const messages = [
      ...history.map(h => ({ role: h.role, content: h.content })),
      {
        role: 'user',
        content: context
          ? `Context: ${JSON.stringify(context)}\n\nQuestion: ${message}`
          : message
      }
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = response.content[0].text;
    res.json({ reply, usage: response.usage });
  } catch (err) {
    if (err.status === 401) return res.status(401).json({ error: 'Invalid Anthropic API key' });
    res.status(500).json({ error: err.message });
  }
};

// @route POST /api/ai/analyze-stock
exports.analyzeStock = async (req, res) => {
  try {
    const { symbol, exchange, stockData, type = 'comprehensive' } = req.body;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    const client = getClient();

    const prompt = type === 'fundamental'
      ? `Perform a comprehensive FUNDAMENTAL analysis of ${symbol} (${exchange}).
         Stock Data: ${JSON.stringify(stockData || {})}
         Include: Valuation metrics, financial health, growth prospects, competitive moat, management quality.
         Provide a BUY/SELL/HOLD recommendation with target price range.`
      : type === 'technical'
      ? `Perform a TECHNICAL analysis of ${symbol} (${exchange}).
         Price Data: ${JSON.stringify(stockData || {})}
         Include: Trend analysis, key support/resistance levels, RSI/MACD signals, chart patterns, short/medium/long-term outlook.`
      : `Provide a COMPREHENSIVE investment analysis of ${symbol} (${exchange}).
         Available Data: ${JSON.stringify(stockData || {})}
         Include both fundamental and technical perspectives, recent news impact, sector outlook, and risk factors.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const analysis = response.content[0].text;

    // Auto-save research
    if (req.user) {
      await Research.create({
        user: req.user._id,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Analysis: ${symbol}`,
        type,
        symbol,
        exchange,
        aiSummary: analysis,
        content: analysis,
      });
    }

    res.json({ analysis, symbol, exchange, type, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route POST /api/ai/summarize-statement
exports.summarizeFinancialStatement = async (req, res) => {
  try {
    const { text, statementType = 'annual report', company } = req.body;
    if (!text) return res.status(400).json({ error: 'Statement text required' });

    const client = getClient();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Analyze this ${statementType} for ${company || 'the company'} and provide:

1. **Executive Summary** (3-4 sentences)
2. **Key Financial Highlights** (revenue, profit, margins, growth %)
3. **Balance Sheet Health** (debt levels, liquidity, asset quality)
4. **Cash Flow Analysis** (operating, investing, financing)
5. **Red Flags / Concerns** (if any)
6. **Positive Indicators**
7. **Year-over-Year Changes** (if comparative data available)
8. **Investment Implication** (brief)

Statement text:
${text.substring(0, 8000)}`
      }],
    });

    res.json({ summary: response.content[0].text, statementType, company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route POST /api/ai/summarize-circular
exports.summarizeCircular = async (req, res) => {
  try {
    const { text, source, title } = req.body;
    if (!text) return res.status(400).json({ error: 'Circular text required' });

    const client = getClient();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Summarize this ${source || 'regulatory'} circular titled "${title || 'Untitled'}".

Provide:
1. **What Changed** (key regulatory update in plain English)
2. **Who is Affected** (which market participants, sectors, instruments)
3. **Effective Date**
4. **Market Impact** (high/medium/low and why)
5. **Action Required** by market participants
6. **Key Compliance Points**

Circular:
${text.substring(0, 6000)}`
      }],
    });

    res.json({ summary: response.content[0].text, source, title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route POST /api/ai/macro-outlook
exports.macroOutlook = async (req, res) => {
  try {
    const { region = 'India', focus } = req.body;
    const client = getClient();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Provide a current macroeconomic outlook for ${region}${focus ? ` focusing on ${focus}` : ''}.
Include: GDP trajectory, inflation/interest rate outlook, currency trends, FII/DII flows, key risks, sector rotation themes, and near-term market outlook.`
      }],
    });

    res.json({ outlook: response.content[0].text, region });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
