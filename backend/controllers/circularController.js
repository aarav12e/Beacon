const Circular = require('../models/Circular');

exports.getAll = async (req, res) => {
  try {
    const { source, page = 1, limit = 20, impact } = req.query;
    const filter = {};
    if (source) filter.source = source.toUpperCase();
    if (impact) filter.impactLevel = impact;

    const total = await Circular.countDocuments(filter);
    const items = await Circular.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // If DB empty, return mock data
    if (!items.length) {
      return res.json({ items: getMockCirculars(), total: 6, page: 1, pages: 1 });
    }

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.seed = async (req, res) => {
  try {
    await Circular.insertMany(getMockCirculars());
    res.json({ message: 'Circulars seeded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function getMockCirculars() {
  return [
    {
      title: 'Guidelines on Algorithmic Trading for Retail Investors',
      source: 'SEBI', circularNo: 'SEBI/HO/MRD/2024/001',
      category: 'Trading', publishedAt: new Date('2024-03-15'),
      impactLevel: 'high', sectors: ['Broking', 'Technology'],
      aiSummary: 'SEBI has introduced new framework allowing retail investors to use algorithmic trading with specific safeguards including mandatory kill switch, order limits, and audit trails.',
      body: 'Full circular text here...'
    },
    {
      title: 'Revised Framework for Corporate Bonds and Debentures',
      source: 'SEBI', circularNo: 'SEBI/HO/DDHS/2024/015',
      category: 'Fixed Income', publishedAt: new Date('2024-03-10'),
      impactLevel: 'medium', sectors: ['BFSI', 'Corporate Finance'],
      aiSummary: 'Updated disclosure norms and listing requirements for listed debt securities aimed at improving market transparency.',
      body: 'Full circular text here...'
    },
    {
      title: 'Monetary Policy Committee — Interest Rate Decision',
      source: 'RBI', circularNo: 'RBI/2024-25/50',
      category: 'Monetary Policy', publishedAt: new Date('2024-03-08'),
      impactLevel: 'high', sectors: ['BFSI', 'Real Estate', 'Auto'],
      aiSummary: 'RBI MPC kept repo rate unchanged at 6.5%. GDP growth forecast raised to 7.0% for FY25. Inflation expected to moderate to 4.5% by Q4.',
      body: 'Full circular text here...'
    },
    {
      title: 'KYC Norms for FPI Registration — Simplified Framework',
      source: 'SEBI', circularNo: 'SEBI/HO/AFD/2024/022',
      category: 'FPI', publishedAt: new Date('2024-02-28'),
      impactLevel: 'medium', sectors: ['All'],
      aiSummary: 'SEBI simplifies KYC requirements for Foreign Portfolio Investors to boost overseas investment inflows.',
      body: 'Full circular text here...'
    },
    {
      title: 'Priority Sector Lending — Updated Targets and Classification',
      source: 'RBI', circularNo: 'RBI/2024-25/42',
      category: 'Banking', publishedAt: new Date('2024-02-20'),
      impactLevel: 'medium', sectors: ['BFSI', 'Agriculture', 'MSME'],
      aiSummary: 'RBI revises PSL targets with increased focus on MSME and renewable energy sectors.',
      body: 'Full circular text here...'
    },
    {
      title: 'NSE Co-location Facility — Enhanced Security Standards',
      source: 'NSE', circularNo: 'NSE/COMP/2024/008',
      category: 'Infrastructure', publishedAt: new Date('2024-02-15'),
      impactLevel: 'low', sectors: ['Technology', 'Broking'],
      aiSummary: 'NSE announces enhanced cybersecurity protocols for co-location facility users effective Q2 2024.',
      body: 'Full circular text here...'
    },
  ];
}
