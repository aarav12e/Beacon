# ▲ BEACON — AI-Powered Financial Intelligence Platform
### Claude + Bloomberg = Beacon

> A full-stack MERN application that combines **Anthropic Claude AI** with financial market data for investment research, stock analysis, and regulatory intelligence — focused on Indian markets (NSE, BSE, SEBI, RBI).

---

## 🏗️ Architecture

```
MERN Stack
├── MongoDB      → User data, research reports, watchlists, regulatory circulars
├── Express.js   → REST API, auth middleware, rate limiting
├── React.js     → Dashboard, charts, AI terminal, landing page
└── Node.js      → Backend server, Claude API integration, stock data
```

---

## 📁 Project Structure

```
beacon/
├── backend/
│   ├── server.js                    ← Express entry point
│   ├── config/db.js                 ← MongoDB connection
│   ├── middleware/auth.js           ← JWT authentication
│   ├── models/
│   │   ├── User.js                  ← User schema
│   │   ├── Stock.js                 ← Stock/OHLCV schema
│   │   ├── Research.js              ← AI research reports
│   │   ├── Watchlist.js             ← User watchlists
│   │   └── Circular.js              ← SEBI/RBI circulars
│   ├── controllers/
│   │   ├── authController.js        ← Register, login, JWT
│   │   ├── stockController.js       ← Market data, quotes, movers
│   │   ├── aiController.js          ← Claude AI integration
│   │   ├── researchController.js    ← CRUD for research
│   │   ├── circularController.js    ← Regulatory circulars
│   │   └── excelController.js       ← Excel/CSV parsing + AI
│   └── routes/                      ← Express routers
│
├── frontend/
│   └── src/
│       ├── App.js                   ← Router + Auth wrapper
│       ├── pages/
│       │   ├── LandingPage.js       ← Animated SVG hero landing page
│       │   ├── LoginPage.js         ← Auth page
│       │   ├── Dashboard.js         ← Main dashboard with market data
│       │   ├── StockResearch.js     ← Stock charts + AI analysis
│       │   ├── AIChat.js            ← Claude AI terminal
│       │   ├── ResearchPage.js      ← Research library
│       │   ├── Circulars.js         ← SEBI/RBI regulatory feed
│       │   └── ExcelAgent.js        ← Excel upload + AI analysis
│       ├── components/common/
│       │   └── Sidebar.js           ← Navigation sidebar
│       ├── context/AuthContext.js   ← Auth state
│       ├── services/api.js          ← Axios API layer
│       └── styles/global.css        ← Dark finance theme
│
├── package.json                     ← Root (concurrently)
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com)
- Alpha Vantage API key (free) → [alphavantage.co](https://www.alphavantage.co)

### 1. Clone & Install
```bash
git clone <repo>
cd beacon
npm run install-all
```

### 2. Configure Environment
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/beacon_db
JWT_SECRET=your_secret_key_here
ANTHROPIC_API_KEY=sk-ant-...
ALPHA_VANTAGE_API_KEY=your_key_here
CLIENT_URL=http://localhost:3000
```

### 3. Run Development
```bash
# From root directory
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### 4. Seed Demo Data
```bash
curl -X POST http://localhost:5000/api/circulars/seed
```

---

## 🚀 Features

### 1. Investment Research Platform
- Real-time NSE/BSE/MCX market data via Alpha Vantage
- NIFTY 50, SENSEX, sectoral indices, global markets
- Candlestick & area charts with volume
- Top gainers/losers dashboard

### 2. AI Stock Analysis (Claude)
- **Fundamental Analysis** — P/E, EPS, margins, DCF commentary
- **Technical Analysis** — RSI, MACD, support/resistance, chart patterns
- **Comprehensive Reports** — Buy/Sell/Hold with price targets
- Auto-saved to Research Library

### 3. Excel AI Agent
- Upload `.xlsx`, `.xls`, `.csv` financial statements
- Claude extracts key metrics, identifies trends
- Supports: Annual reports, P&L, balance sheets, portfolios
- Formula assistance for financial modeling

### 4. SEBI/RBI Regulatory Intelligence
- Circulars database with AI summaries
- Filter by SEBI, RBI, NSE, BSE, MCA, IRDAI
- Impact level classification (High/Medium/Low)
- Sector tagging

### 5. AI Chat Terminal
- Claude-powered financial analyst chatbot
- Contextual conversation history
- Starter prompts for quick research
- Macro outlook, sector analysis, regulations

### 6. Research Library
- Save and organise all AI-generated reports
- Filter by type: fundamental, technical, macro, sector
- Buy/Sell/Hold tagging
- Full report viewer

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Stocks
```
GET /api/stocks/market-summary
GET /api/stocks/movers
GET /api/stocks/search?q=RELIANCE
GET /api/stocks/quote/:symbol?exchange=NSE
GET /api/stocks/history/:symbol?period=1M
```

### AI (Claude)
```
POST /api/ai/chat
POST /api/ai/analyze-stock
POST /api/ai/summarize-statement
POST /api/ai/summarize-circular
POST /api/ai/macro-outlook
```

### Research
```
GET    /api/research
POST   /api/research
GET    /api/research/:id
PUT    /api/research/:id
DELETE /api/research/:id
```

### Excel
```
POST /api/excel/analyze         (multipart)
POST /api/excel/formula-assist
```

### Circulars
```
GET  /api/circulars?source=SEBI
POST /api/circulars/seed
```

---

## 🔮 Upgrade Path (Phase 2)

| Feature | Integration |
|---------|------------|
| NSE live WebSocket | NSE data feed / Upstox API |
| Corporate announcements | BSE API / NSEIndia scraper |
| Portfolio tracker | MongoDB + React state |
| Broker integration | Zerodha Kite Connect API |
| Screener | Custom MongoDB aggregation |
| PDF report export | Puppeteer / pdfkit |
| Email alerts | Nodemailer + cron |
| Multi-user teams | Role-based access control |

---

## ⚠️ Disclaimer

> Beacon is an informational and research tool. It is **not** a SEBI-registered investment advisor. All AI-generated analysis is for educational and research purposes only. Do not make investment decisions based solely on AI output. Always consult a qualified financial advisor.

---

Built with ◆ Claude AI + ▲ Bloomberg-inspired financial UX
