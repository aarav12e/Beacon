const axios = require('axios');
const Stock = require('../models/Stock');

// Simulated real-time data (replace Alpha Vantage keys for live)
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';

// @route GET /api/stocks/quote/:symbol
exports.getQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { exchange = 'NSE' } = req.query;

    // Try DB cache first (< 5 min old)
    let stock = await Stock.findOne({ symbol: symbol.toUpperCase(), exchange });
    const isStale = !stock || (Date.now() - stock.lastUpdated > 5 * 60 * 1000);

    if (isStale && process.env.ALPHA_VANTAGE_API_KEY) {
      try {
        const suffix = exchange === 'NSE' ? '.BSE' : '';
        const { data } = await axios.get(ALPHA_VANTAGE_BASE, {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: `${symbol}${suffix}`,
            apikey: process.env.ALPHA_VANTAGE_API_KEY,
          }
        });

        const q = data['Global Quote'];
        if (q && q['05. price']) {
          const update = {
            price:     parseFloat(q['05. price']),
            change:    parseFloat(q['09. change']),
            changePct: parseFloat(q['10. change percent']),
            volume:    parseInt(q['06. volume']),
            lastUpdated: new Date(),
          };

          stock = await Stock.findOneAndUpdate(
            { symbol: symbol.toUpperCase(), exchange },
            { $set: update },
            { upsert: true, new: true }
          );
        }
      } catch (apiErr) {
        console.error('Alpha Vantage error:', apiErr.message);
      }
    }

    // If no stock found, return mock data for demo
    if (!stock) {
      stock = generateMockQuote(symbol, exchange);
    }

    res.json({ stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route GET /api/stocks/search
exports.searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });

    const stocks = await Stock.find({
      $or: [
        { symbol: { $regex: q, $options: 'i' } },
        { name:   { $regex: q, $options: 'i' } },
      ]
    }).limit(10);

    // If DB empty, return mock suggestions
    if (!stocks.length) {
      return res.json({ results: getMockSuggestions(q) });
    }

    res.json({ results: stocks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route GET /api/stocks/market-summary
exports.getMarketSummary = async (req, res) => {
  try {
    // Returns major Indian + global indices
    res.json({
      indices: [
        { name: 'NIFTY 50',    value: 22547.00, change: 142.35,   changePct: 0.64,  exchange: 'NSE' },
        { name: 'SENSEX',      value: 74339.44, change: 487.00,   changePct: 0.66,  exchange: 'BSE' },
        { name: 'NIFTY BANK',  value: 48201.50, change: -89.20,   changePct: -0.19, exchange: 'NSE' },
        { name: 'NIFTY IT',    value: 36742.80, change: 520.00,   changePct: 1.44,  exchange: 'NSE' },
        { name: 'S&P 500',     value: 5248.00,  change: 18.42,    changePct: 0.35,  exchange: 'NYSE' },
        { name: 'NASDAQ',      value: 16432.00, change: 95.15,    changePct: 0.58,  exchange: 'NASDAQ' },
        { name: 'USD/INR',     value: 83.42,    change: -0.08,    changePct: -0.10, exchange: 'FOREX' },
        { name: 'GOLD (MCX)',  value: 71250,    change: 385,      changePct: 0.54,  exchange: 'MCX' },
        { name: 'CRUDE OIL',   value: 6542,     change: -82,      changePct: -1.24, exchange: 'MCX' },
      ],
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route GET /api/stocks/history/:symbol
exports.getHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1M', exchange = 'NSE' } = req.query;

    // Generate mock OHLCV data for demo
    const data = generateHistoricalData(symbol, period);
    res.json({ symbol, exchange, period, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route GET /api/stocks/movers
exports.getTopMovers = async (req, res) => {
  try {
    const movers = {
      gainers: [
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2945.30, changePct: 3.42 },
        { symbol: 'TCS',      name: 'Tata Consultancy',   price: 4120.00, changePct: 2.87 },
        { symbol: 'INFY',     name: 'Infosys',            price: 1845.50, changePct: 2.14 },
        { symbol: 'HDFCBANK', name: 'HDFC Bank',          price: 1592.00, changePct: 1.98 },
        { symbol: 'WIPRO',    name: 'Wipro Ltd',          price: 478.00,  changePct: 1.75 },
      ],
      losers: [
        { symbol: 'ZOMATO',  name: 'Zomato Ltd',          price: 172.50,  changePct: -3.12 },
        { symbol: 'PAYTM',   name: 'One97 Communications',price: 358.00,  changePct: -2.89 },
        { symbol: 'BPCL',    name: 'BPCL',                price: 598.00,  changePct: -2.01 },
        { symbol: 'COALINDIA',name:'Coal India',           price: 452.00,  changePct: -1.87 },
        { symbol: 'ONGC',    name: 'ONGC Ltd',            price: 268.00,  changePct: -1.56 },
      ],
    };
    res.json(movers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateMockQuote(symbol, exchange) {
  const base = Math.random() * 5000 + 200;
  return {
    symbol, exchange,
    name: symbol + ' Ltd',
    price: parseFloat(base.toFixed(2)),
    change: parseFloat((Math.random() * 100 - 50).toFixed(2)),
    changePct: parseFloat((Math.random() * 6 - 3).toFixed(2)),
    volume: Math.floor(Math.random() * 10000000),
    high52w: parseFloat((base * 1.3).toFixed(2)),
    low52w:  parseFloat((base * 0.7).toFixed(2)),
    pe: parseFloat((Math.random() * 40 + 10).toFixed(1)),
    lastUpdated: new Date(),
  };
}

function getMockSuggestions(q) {
  const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd',   exchange: 'NSE' },
    { symbol: 'TCS',      name: 'Tata Consultancy Services', exchange: 'NSE' },
    { symbol: 'INFY',     name: 'Infosys Ltd',               exchange: 'NSE' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd',             exchange: 'NSE' },
    { symbol: 'ICICIBANK',name: 'ICICI Bank Ltd',            exchange: 'NSE' },
    { symbol: 'WIPRO',    name: 'Wipro Ltd',                 exchange: 'NSE' },
    { symbol: 'BAJFINANCE',name:'Bajaj Finance Ltd',         exchange: 'NSE' },
    { symbol: 'SBIN',     name: 'State Bank of India',       exchange: 'NSE' },
    { symbol: 'TATAMOTORS',name:'Tata Motors Ltd',           exchange: 'NSE' },
    { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd',     exchange: 'NSE' },
  ];
  return stocks.filter(s =>
    s.symbol.includes(q.toUpperCase()) || s.name.toLowerCase().includes(q.toLowerCase())
  );
}

function generateHistoricalData(symbol, period) {
  const points = period === '1W' ? 7 : period === '1M' ? 30 : period === '3M' ? 90 : period === '1Y' ? 365 : 30;
  let price = Math.random() * 3000 + 500;
  const data = [];
  const now = new Date();

  for (let i = points; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * price * 0.03;
    const open = price;
    price = Math.max(price + change, 10);
    const high = Math.max(open, price) * (1 + Math.random() * 0.01);
    const low  = Math.min(open, price) * (1 - Math.random() * 0.01);
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low:  parseFloat(low.toFixed(2)),
      close: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000 + 500000),
    });
  }
  return data;
}
