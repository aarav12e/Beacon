import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TICKER_DATA = [
  { symbol: 'NIFTY 50', value: '22,547', change: '+0.64%', up: true },
  { symbol: 'SENSEX', value: '74,339', change: '+0.66%', up: true },
  { symbol: 'USD/INR', value: '83.42', change: '-0.10%', up: false },
  { symbol: 'GOLD', value: '₹71,250', change: '+0.54%', up: true },
  { symbol: 'TCS', value: '4,120', change: '+2.87%', up: true },
  { symbol: 'RELIANCE', value: '2,945', change: '+3.42%', up: true },
  { symbol: 'INFY', value: '1,845', change: '+2.14%', up: true },
  { symbol: 'CRUDE OIL', value: '₹6,542', change: '-1.24%', up: false },
];

function AnimatedHeroSVG() {
  const svgRef = useRef(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '520px', overflow: 'hidden' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 900 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8A84B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C8A84B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C8A84B" stopOpacity="0" />
            <stop offset="40%" stopColor="#C8A84B" stopOpacity="1" />
            <stop offset="80%" stopColor="#00D4FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8A84B" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#C8A84B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gridFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A2D45" stopOpacity="0" />
            <stop offset="50%" stopColor="#1A2D45" stopOpacity="1" />
            <stop offset="100%" stopColor="#1A2D45" stopOpacity="0" />
          </linearGradient>
          <filter id="blur-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <clipPath id="chart-clip">
            <rect x="60" y="40" width="780" height="380" />
          </clipPath>
        </defs>

        <rect width="900" height="520" fill="#04060A" />
        <ellipse cx="200" cy="260" rx="300" ry="200" fill="url(#glow1)" />
        <ellipse cx="700" cy="200" rx="250" ry="180" fill="url(#glow2)" />

        {[80, 160, 240, 320, 400].map((y, i) => (
          <line key={i} x1="60" y1={y} x2="840" y2={y} stroke="url(#gridFade)" strokeWidth="0.5" />
        ))}
        {[150, 280, 410, 540, 670, 790].map((x, i) => (
          <line key={i} x1={x} y1="40" x2={x} y2="420" stroke="#1A2D45" strokeWidth="0.5" strokeOpacity="0.5" />
        ))}

        {[
          { y: 80, label: '24,500' },
          { y: 160, label: '23,500' },
          { y: 240, label: '22,500' },
          { y: 320, label: '21,500' },
          { y: 400, label: '20,500' },
        ].map((item, i) => (
          <text key={i} x="50" y={item.y + 4} fill="#3D5470" fontSize="10" textAnchor="end" fontFamily="DM Mono">
            {item.label}
          </text>
        ))}

        <g clipPath="url(#chart-clip)">
          <path
            d="M70,300 C100,290 130,280 160,260 C190,240 220,310 250,290 C280,270 310,220 340,200 C370,180 400,230 430,210 C460,190 490,150 520,130 C550,110 580,170 610,150 C640,130 670,100 700,90 C730,80 760,120 790,100 L790,400 L70,400 Z"
            fill="url(#chartFill)"
          />
          <path
            d="M70,300 C100,290 130,280 160,260 C190,240 220,310 250,290 C280,270 310,220 340,200 C370,180 400,230 430,210 C460,190 490,150 520,130 C550,110 580,170 610,150 C640,130 670,100 700,90 C730,80 760,120 790,100"
            stroke="url(#chartLine)"
            strokeWidth="2.5"
            filter="url(#line-glow)"
          />

          {[
            { x: 95, open: 295, close: 280, high: 270, low: 310 },
            { x: 155, open: 265, close: 255, high: 245, low: 275 },
            { x: 215, open: 305, close: 315, high: 295, low: 325 },
            { x: 275, open: 285, close: 270, high: 260, low: 295 },
            { x: 335, open: 205, close: 195, high: 185, low: 215 },
            { x: 395, open: 235, close: 225, high: 215, low: 245 },
            { x: 455, open: 215, close: 200, high: 190, low: 225 },
            { x: 515, open: 135, close: 125, high: 115, low: 145 },
            { x: 575, open: 175, close: 165, high: 155, low: 185 },
            { x: 635, open: 155, close: 140, high: 130, low: 165 },
            { x: 695, open: 95, close: 85, high: 75, low: 105 },
            { x: 755, open: 125, close: 115, high: 105, low: 135 },
          ].map((c, i) => {
            const isUp = c.close < c.open;
            const color = isUp ? '#00D68F' : '#FF4757';
            return (
              <g key={i}>
                <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={color} strokeWidth="1" />
                <rect
                  x={c.x - 5}
                  y={Math.min(c.open, c.close)}
                  width={10}
                  height={Math.abs(c.open - c.close) || 2}
                  fill={color}
                  rx="1"
                />
              </g>
            );
          })}
        </g>

        <path
          d="M70,300 C150,280 230,270 310,220 C390,170 470,175 550,140 C630,105 710,95 790,88"
          stroke="#00D4FF"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.5"
          clipPath="url(#chart-clip)"
        />

        <g transform="translate(620, 50)">
          <rect width="220" height="90" rx="8" fill="#0D1520" stroke="#1A2D45" strokeWidth="1" />
          <rect width="220" height="90" rx="8" fill="#C8A84B" fillOpacity="0.05" />
          <text x="16" y="28" fill="#7A94B0" fontSize="10" fontFamily="DM Mono">NIFTY 50 · LIVE</text>
          <circle cx="196" cy="22" r="5" fill="#00D68F">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <text x="16" y="56" fill="#E8EDF5" fontSize="24" fontFamily="DM Serif Display" fontWeight="400">22,547</text>
          <text x="16" y="76" fill="#00D68F" fontSize="12" fontFamily="DM Mono">+142.35  +0.64%</text>
        </g>

        <g transform="translate(30, 50)">
          <rect width="180" height="75" rx="8" fill="#0D1520" stroke="#1A2D45" strokeWidth="1" />
          <text x="14" y="26" fill="#7A94B0" fontSize="10" fontFamily="DM Mono">SENSEX</text>
          <text x="14" y="50" fill="#E8EDF5" fontSize="20" fontFamily="DM Serif Display">74,339</text>
          <text x="14" y="66" fill="#00D68F" fontSize="11" fontFamily="DM Mono">+487.00  +0.66%</text>
        </g>

        <g transform="translate(30, 165)">
          <rect width="200" height="120" rx="8" fill="#0D1520" stroke="#C8A84B" strokeWidth="0.5" strokeOpacity="0.5" />
          <rect width="200" height="30" rx="8" fill="#C8A84B" fillOpacity="0.1" />
          <rect width="200" height="8" y="22" fill="#C8A84B" fillOpacity="0.1" />
          <text x="14" y="20" fill="#C8A84B" fontSize="10" fontFamily="DM Mono" fontWeight="500">◆ BEACON AI SIGNAL</text>
          <text x="14" y="48" fill="#E8EDF5" fontSize="12" fontFamily="Syne" fontWeight="600">Bullish Momentum</text>
          <text x="14" y="66" fill="#7A94B0" fontSize="10" fontFamily="DM Mono">RSI: 62 · MACD: +ve</text>
          <text x="14" y="84" fill="#7A94B0" fontSize="10" fontFamily="DM Mono">Target: 23,200</text>
          <text x="14" y="102" fill="#7A94B0" fontSize="10" fontFamily="DM Mono">Stop: 22,100</text>
          <rect x="14" y="110" width="60" height="1" fill="#C8A84B" fillOpacity="0.4" />
        </g>

        <g opacity="0.5" clipPath="url(#chart-clip)">
          {[70, 130, 190, 250, 310, 370, 430, 490, 550, 610, 670, 730, 790].map((x, i) => {
            const h = Math.random() * 30 + 10;
            const isUp = Math.random() > 0.4;
            return (
              <rect
                key={i}
                x={x - 15}
                y={420 - h}
                width={22}
                height={h}
                fill={isUp ? '#00D68F' : '#FF4757'}
                fillOpacity="0.5"
                rx="1"
              />
            );
          })}
        </g>

        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => (
          <text key={i} x={150 + i * 130} y="440" fill="#3D5470" fontSize="10" textAnchor="middle" fontFamily="DM Mono">
            {m} '25
          </text>
        ))}

        <text x="450" y="500" fill="#1A2D45" fontSize="48" fontFamily="DM Serif Display" textAnchor="middle" opacity="0.3">
          BEACON
        </text>

        <rect width="900" height="2" fill="url(#chartLine)" opacity="0.15">
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0,0"
            to="0,520"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>

        <path d="M60,40 L60,60 M60,40 L80,40" stroke="#C8A84B" strokeWidth="1.5" opacity="0.6" />
        <path d="M840,40 L840,60 M840,40 L820,40" stroke="#C8A84B" strokeWidth="1.5" opacity="0.6" />
        <path d="M60,420 L60,400 M60,420 L80,420" stroke="#C8A84B" strokeWidth="1.5" opacity="0.6" />
        <path d="M840,420 L840,400 M840,420 L820,420" stroke="#C8A84B" strokeWidth="1.5" opacity="0.6" />
      </svg>
    </div>
  );
}

function Ticker() {
  return (
    <div style={{
      background: '#080D16',
      borderBottom: '1px solid #1A2D45',
      borderTop: '1px solid #1A2D45',
      padding: '10px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        gap: '48px',
        animation: 'tickerScroll 30s linear infinite',
        whiteSpace: 'nowrap',
      }}>
        {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#7A94B0', fontSize: '11px', fontFamily: 'DM Mono', fontWeight: 500 }}>{item.symbol}</span>
            <span style={{ color: '#E8EDF5', fontSize: '12px', fontFamily: 'DM Mono', fontWeight: 500 }}>{item.value}</span>
            <span style={{ color: item.up ? '#00D68F' : '#FF4757', fontSize: '11px', fontFamily: 'DM Mono' }}>{item.change}</span>
            <span style={{ color: '#1A2D45' }}>·</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '60px',
        background: 'rgba(4,6,10,0.95)',
        borderBottom: '1px solid #1A2D45',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="26" height="26" viewBox="0 0 28 28">
            <polygon points="14,2 26,26 2,26" fill="none" stroke="#C8A84B" strokeWidth="2" />
            <polygon points="14,8 22,24 6,24" fill="#C8A84B" opacity="0.2" />
            <line x1="14" y1="2" x2="14" y2="26" stroke="#C8A84B" strokeWidth="1" opacity="0.5" />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#E8EDF5', letterSpacing: '0.04em' }}>
            Beacon
          </span>
          <span className="landing-tagline" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C8A84B', marginLeft: '4px', letterSpacing: '0.12em' }}>
            FINANCIAL INTELLIGENCE
          </span>
        </div>

        <div className="landing-nav-links" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {['Markets', 'Research', 'AI Agents', 'Regulators'].map(item => (
            <button key={item} className="btn-ghost" style={{ fontSize: '13px' }}>{item}</button>
          ))}
          <button
            className="btn-outline"
            onClick={() => navigate('/login')}
            style={{ marginLeft: '8px' }}
          >
            Sign In
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* Ticker */}
      <Ticker />

      {/* Hero */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease',
      }}>
        <div className="landing-hero-grid">
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(200,168,75,0.1)', border: '1px solid rgba(200,168,75,0.3)',
              borderRadius: '2px', padding: '6px 14px', marginBottom: '28px',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D68F', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8A84B', letterSpacing: '0.12em' }}>
                CLAUDE + BLOOMBERG = BEACON
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 6vw, 64px)',
              lineHeight: '1.05',
              color: '#E8EDF5',
              marginBottom: '20px',
              letterSpacing: '-0.01em',
            }}>
              Where AI Meets<br />
              <span style={{ color: '#C8A84B', fontStyle: 'italic' }}>Capital Markets</span>
            </h1>

            <p style={{
              fontSize: '16px', color: '#7A94B0', lineHeight: '1.7', marginBottom: '32px', maxWidth: '460px',
            }}>
              Beacon fuses Claude AI with financial market intelligence — giving analysts, traders, and researchers an unfair advantage through real-time data, AI-powered analysis, and regulatory intelligence.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '13px 28px', fontSize: '15px' }}>
                Start Researching →
              </button>
              <button className="btn-outline" style={{ padding: '13px 24px', fontSize: '15px' }}>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {[
                { value: '5,000+', label: 'Stocks Tracked' },
                { value: 'Real-time', label: 'NSE · BSE · MCX' },
                { value: 'Claude AI', label: 'Powered Analysis' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#C8A84B' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#7A94B0', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — SVG Hero (hidden on mobile via CSS class) */}
          <div className="landing-hero-svg" style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: '-20px',
              background: 'radial-gradient(ellipse at center, rgba(200,168,75,0.08) 0%, transparent 70%)',
              borderRadius: '16px',
            }} />
            <div style={{
              border: '1px solid #1A2D45',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 0 60px rgba(200,168,75,0.1)',
            }}>
              <div style={{
                background: '#080D16',
                padding: '10px 16px',
                borderBottom: '1px solid #1A2D45',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF4757', opacity: 0.8 }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C8A84B', opacity: 0.8 }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00D68F', opacity: 0.8 }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3D5470' }}>NIFTY 50 — 1D Chart</span>
              </div>
              <AnimatedHeroSVG />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1280px', margin: '80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', color: '#E8EDF5', marginBottom: '16px' }}>
            The Complete Financial Intelligence Stack
          </h2>
          <p style={{ color: '#7A94B0', fontSize: '16px', maxWidth: '560px', margin: '0 auto' }}>
            Built for Indian &amp; global markets. Powered by Claude AI. Designed for serious financial professionals.
          </p>
        </div>

        <div className="landing-features-grid">
          {[
            {
              icon: '◈',
              title: 'AI Stock Analysis',
              desc: 'Fundamental & technical deep-dives on any NSE/BSE/NYSE stock. Claude analyzes financials, charts, and generates actionable research reports in seconds.',
              color: '#C8A84B',
              tags: ['Fundamental', 'Technical', 'AI-Powered'],
            },
            {
              icon: '⬡',
              title: 'Excel AI Agent',
              desc: 'Upload any financial spreadsheet. Claude extracts key metrics, identifies trends, summarizes annual reports, and answers questions about your data.',
              color: '#00D4FF',
              tags: ['P&L Analysis', 'Balance Sheet', 'Cash Flow'],
            },
            {
              icon: '◎',
              title: 'Regulatory Intelligence',
              desc: 'SEBI and RBI circulars summarized in plain English by AI. Know the market impact, who is affected, and compliance requirements instantly.',
              color: '#00D68F',
              tags: ['SEBI', 'RBI', 'NSE/BSE Circulars'],
            },
            {
              icon: '◇',
              title: 'Research Platform',
              desc: 'Save, organize, and share investment research. Covers equities, fixed income, commodities, forex, and mutual funds — all asset classes.',
              color: '#C8A84B',
              tags: ['Multi-Asset', 'Portfolio', 'Reports'],
            },
            {
              icon: '△',
              title: 'Real-Time Market Data',
              desc: 'Live prices, corporate announcements, insider trades, and block deals. Nifty 50, sectoral indices, global markets — all in one terminal.',
              color: '#FF4757',
              tags: ['NSE Live', 'BSE Live', 'MCX'],
            },
            {
              icon: '▣',
              title: 'AI Chat Terminal',
              desc: 'Ask anything about markets, companies, sectors, or regulations. Claude responds like a senior analyst with deep knowledge of Indian and global finance.',
              color: '#00D4FF',
              tags: ['GPT for Finance', 'India Focused', '24/7'],
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: '#0D1520',
                border: `1px solid ${feature.color}22`,
                borderRadius: '12px',
                padding: '28px',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = feature.color + '55';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 40px ${feature.color}15`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = feature.color + '22';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '28px', color: feature.color, marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#E8EDF5', marginBottom: '12px' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#7A94B0', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>{feature.desc}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {feature.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 8px',
                    background: feature.color + '15', color: feature.color,
                    border: `1px solid ${feature.color}30`, borderRadius: '2px', letterSpacing: '0.06em',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: '1280px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div className="landing-cta-padding" style={{
          background: 'linear-gradient(135deg, #0D1520 0%, #111D2E 100%)',
          border: '1px solid #1A2D45',
          borderRadius: '16px',
          padding: '64px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
            width: '400px', height: '200px',
            background: 'radial-gradient(ellipse, rgba(200,168,75,0.15) 0%, transparent 70%)',
          }} />
          <h2 className="landing-cta-title" style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: '#E8EDF5', marginBottom: '20px' }}>
            Ready to <span style={{ color: '#C8A84B', fontStyle: 'italic' }}>outperform</span> the market?
          </h2>
          <p style={{ color: '#7A94B0', fontSize: '17px', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px' }}>
            Join financial professionals who use Beacon to make faster, smarter investment decisions.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ padding: '16px 48px', fontSize: '16px' }}
          >
            Launch Beacon Platform →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer" style={{
        borderTop: '1px solid #1A2D45',
        padding: '28px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#3D5470',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)',
      }}>
        <span>▲ BEACON FINANCIAL INTELLIGENCE — CLAUDE + BLOOMBERG</span>
        <span>⚠️ Not SEBI registered. For informational purposes only.</span>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .landing-tagline { display: none; }
        }
      `}</style>
    </div>
  );
}
