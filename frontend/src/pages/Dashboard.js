import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { stocksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

const mockMiniChart = (base, up) =>
  Array.from({ length: 20 }, (_, i) => ({
    v: base + (up ? 1 : -1) * i * (Math.random() * 2 + 0.5) + (Math.random() - 0.5) * 3,
  }));

function MarketCard({ name, value, change, changePct, exchange }) {
  const up = changePct >= 0;
  const data = mockMiniChart(parseFloat(value.toString().replace(/,/g, '')), up);
  return (
    <div style={{
      background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '10px',
      padding: '18px', minWidth: '180px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7A94B0', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>{name}</div>
          <div style={{ fontSize: '20px', fontFamily: 'var(--font-display)', color: '#E8EDF5' }}>
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: up ? '#00D68F' : '#FF4757', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {up ? '+' : ''}{changePct?.toFixed(2)}%
          </div>
          <div style={{ fontSize: '11px', color: '#3D5470', fontFamily: 'var(--font-mono)' }}>{exchange}</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={40}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke={up ? '#00D68F' : '#FF4757'} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function MoverRow({ symbol, name, price, changePct }) {
  const up = changePct >= 0;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid #1A2D45',
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#E8EDF5', fontWeight: 600 }}>{symbol}</div>
        <div style={{ fontSize: '11px', color: '#7A94B0', marginTop: '2px' }}>{name}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#E8EDF5' }}>₹{price?.toLocaleString()}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: up ? '#00D68F' : '#FF4757', marginTop: '2px' }}>
          {up ? '+' : ''}{changePct?.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

const areaData = Array.from({ length: 60 }, (_, i) => ({
  t: i,
  nifty: 21500 + i * 18 + Math.sin(i * 0.4) * 200 + Math.random() * 80,
}));

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary]   = useState(null);
  const [movers, setMovers]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [time, setTime]         = useState(new Date());

  useEffect(() => {
    Promise.all([stocksAPI.marketSummary(), stocksAPI.movers()])
      .then(([s, m]) => { setSummary(s.data); setMovers(m.data); })
      .catch(console.error)
      .finally(() => setLoading(false));

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, overflowX: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 32px', borderBottom: '1px solid #1A2D45',
          background: '#080D16', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#E8EDF5' }}>
              Good {time.getHours() < 12 ? 'morning' : time.getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'Analyst'}
            </h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', marginTop: '2px' }}>
              {time.toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', padding: '8px 16px', background: '#0D1520', borderRadius: '6px', border: '1px solid #1A2D45' }}>
              NSE · Market Hours
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', background: 'rgba(0,214,143,0.08)',
              border: '1px solid rgba(0,214,143,0.2)', borderRadius: '6px',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D68F', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D68F' }}>LIVE</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>
          {/* Market indices */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', letterSpacing: '0.1em', marginBottom: '16px' }}>
              ◈ MARKET OVERVIEW
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {(summary?.indices || []).map(idx => (
                <MarketCard key={idx.name} {...idx} />
              ))}
            </div>
          </div>

          {/* Main content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* NIFTY area chart */}
            <div style={{ background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', letterSpacing: '0.08em' }}>NIFTY 50 — INTRADAY</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#E8EDF5', marginTop: '4px' }}>22,547.00</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#00D68F' }}>+142.35 (+0.64%)</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['1D','1W','1M','3M','1Y'].map(p => (
                    <button key={p} style={{
                      padding: '4px 10px', borderRadius: '4px', border: '1px solid #1A2D45',
                      background: p === '1D' ? 'rgba(200,168,75,0.15)' : 'transparent',
                      color: p === '1D' ? '#C8A84B' : '#7A94B0',
                      fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    }}>{p}</button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#C8A84B" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#C8A84B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2D45" />
                  <XAxis dataKey="t" hide />
                  <YAxis domain={['auto','auto']} tick={{ fill: '#3D5470', fontSize: 10, fontFamily: 'DM Mono' }} width={55} tickFormatter={v => v.toFixed(0)} />
                  <Tooltip
                    contentStyle={{ background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '6px', fontFamily: 'DM Mono', fontSize: '12px' }}
                    labelStyle={{ color: '#7A94B0' }}
                    itemStyle={{ color: '#C8A84B' }}
                    formatter={v => [v.toFixed(2), 'NIFTY']}
                  />
                  <Area type="monotone" dataKey="nifty" stroke="#C8A84B" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Movers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '10px', padding: '20px', flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D68F', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  ▲ TOP GAINERS
                </div>
                {(movers?.gainers || []).map(s => <MoverRow key={s.symbol} {...s} />)}
              </div>
              <div style={{ background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '10px', padding: '20px', flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FF4757', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  ▼ TOP LOSERS
                </div>
                {(movers?.losers || []).map(s => <MoverRow key={s.symbol} {...s} />)}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { icon: '◆', title: 'AI Analysis', desc: 'Analyze any stock with Claude', path: '/ai-chat', color: '#C8A84B' },
              { icon: '⬡', title: 'Excel Agent', desc: 'Upload financial statements', path: '/excel', color: '#00D4FF' },
              { icon: '▣', title: 'SEBI/RBI Circulars', desc: 'Latest regulatory updates', path: '/circulars', color: '#00D68F' },
              { icon: '◇', title: 'Research Library', desc: 'Your saved reports', path: '/research', color: '#FF4757' },
            ].map(action => (
              <div key={action.path} onClick={() => window.location.pathname = action.path} style={{
                background: '#0D1520', border: `1px solid ${action.color}22`,
                borderRadius: '10px', padding: '20px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = action.color + '55'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = action.color + '22'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '20px', color: action.color, marginBottom: '10px' }}>{action.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EDF5', marginBottom: '4px' }}>{action.title}</div>
                <div style={{ fontSize: '12px', color: '#7A94B0' }}>{action.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
