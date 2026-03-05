import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { stocksAPI, aiAPI } from '../services/api';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const POPULAR = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'WIPRO', 'BAJFINANCE', 'SBIN', 'TATAMOTORS', 'ADANIENT'];

function StatBox({ label, value, sub }) {
  return (
    <div style={{ background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '8px', padding: '14px 16px' }}>
      <div style={{ fontSize: '11px', color: '#7A94B0', fontFamily: 'var(--font-mono)', marginBottom: '6px', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: '#E8EDF5' }}>{value || '—'}</div>
      {sub && <div style={{ fontSize: '11px', color: '#3D5470', marginTop: '3px' }}>{sub}</div>}
    </div>
  );
}

export default function StockResearch() {
  const [search, setSearch] = useState('');
  const [suggestions, setSugg] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState('1M');
  const [analysis, setAnalysis] = useState('');
  const [aiType, setAiType] = useState('comprehensive');
  const [analysing, setAnalysing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.length < 1) return setSugg([]);
    try {
      const res = await stocksAPI.search(q);
      setSugg(res.data.results || []);
    } catch { setSugg([]); }
  };

  const loadStock = async (symbol, exchange = 'NSE') => {
    setSelected({ symbol, exchange });
    setSearch(symbol);
    setSugg([]);
    setAnalysis('');
    setLoading(true);
    try {
      const [q, h] = await Promise.all([
        stocksAPI.quote(symbol, exchange),
        stocksAPI.history(symbol, period, exchange),
      ]);
      setQuote(q.data.stock);
      setHistory(h.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const runAnalysis = async () => {
    if (!selected) return;
    setAnalysing(true); setAnalysis('');
    try {
      const res = await aiAPI.analyzeStock({
        symbol: selected.symbol, exchange: selected.exchange,
        stockData: quote, type: aiType,
      });
      setAnalysis(res.data.analysis);
    } catch (err) {
      setAnalysis('⚠️ Analysis failed: ' + (err.response?.data?.error || err.message));
    } finally { setAnalysing(false); }
  };

  useEffect(() => {
    if (selected) {
      stocksAPI.history(selected.symbol, period, selected.exchange)
        .then(r => setHistory(r.data.data || []))
        .catch(console.error);
    }
  }, [period, selected]);

  const up = (quote?.changePct || 0) >= 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, overflowX: 'hidden' }}>
        {/* Header */}
        <div className="page-header" style={{ padding: '16px 32px', borderBottom: '1px solid #1A2D45', background: '#080D16' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#E8EDF5', marginBottom: '12px' }}>
            Stock Research
          </h2>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search symbol or company name..."
              style={{ width: '100%', paddingLeft: '40px', borderColor: '#1A2D45' }}
            />
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#7A94B0' }}>◈</span>
            {suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '8px',
                zIndex: 100, marginTop: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}>
                {suggestions.map(s => (
                  <div key={s.symbol} onClick={() => loadStock(s.symbol, s.exchange)} style={{
                    padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    borderBottom: '1px solid #1A2D45',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#111D2E'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#E8EDF5', fontWeight: 600 }}>{s.symbol}</div>
                      <div style={{ fontSize: '12px', color: '#7A94B0' }}>{s.name}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8A84B', padding: '2px 8px', background: 'rgba(200,168,75,0.1)', borderRadius: '2px', alignSelf: 'center' }}>
                      {s.exchange}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Popular */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            {POPULAR.map(sym => (
              <button key={sym} onClick={() => loadStock(sym)} style={{
                padding: '4px 12px', borderRadius: '3px',
                background: selected?.symbol === sym ? 'rgba(200,168,75,0.15)' : 'rgba(255,255,255,0.03)',
                border: selected?.symbol === sym ? '1px solid rgba(200,168,75,0.4)' : '1px solid #1A2D45',
                color: selected?.symbol === sym ? '#C8A84B' : '#7A94B0',
                fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
              }}>{sym}</button>
            ))}
          </div>
        </div>

        <div className="page-content" style={{ padding: '28px 32px' }}>
          {!selected ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#3D5470' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>◈</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#7A94B0', marginBottom: '8px' }}>Select a stock to begin</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Search by symbol or click a popular stock above</div>
            </div>
          ) : (
            <>
              {/* Quote header */}
              {quote && (
                <div style={{ marginBottom: '24px', display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#7A94B0', marginBottom: '4px' }}>
                      {selected.symbol} · {selected.exchange}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: '#E8EDF5', lineHeight: 1 }}>
                      ₹{quote.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: up ? '#00D68F' : '#FF4757', marginTop: '6px' }}>
                      {up ? '▲' : '▼'} {Math.abs(quote.change)?.toFixed(2)} ({Math.abs(quote.changePct)?.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              )}

              {/* Stat boxes */}
              {quote && (
                <div className="stock-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <StatBox label="P/E RATIO" value={quote.pe?.toFixed(1)} />
                  <StatBox label="EPS" value={quote.eps ? '₹' + quote.eps?.toFixed(2) : '—'} />
                  <StatBox label="52W HIGH" value={quote.high52w ? '₹' + quote.high52w?.toLocaleString() : '—'} />
                  <StatBox label="52W LOW" value={quote.low52w ? '₹' + quote.low52w?.toLocaleString() : '—'} />
                  <StatBox label="VOLUME" value={quote.volume ? (quote.volume / 1e6).toFixed(2) + 'M' : '—'} />
                  <StatBox label="MKT CAP" value={quote.marketCap ? '₹' + (quote.marketCap / 1e9).toFixed(0) + 'B' : '—'} />
                </div>
              )}

              {/* Chart */}
              <div style={{ background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', letterSpacing: '0.08em' }}>
                    {selected.symbol} — PRICE CHART
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['1W', '1M', '3M', '1Y'].map(p => (
                      <button key={p} onClick={() => setPeriod(p)} style={{
                        padding: '4px 10px', borderRadius: '4px',
                        background: period === p ? 'rgba(200,168,75,0.15)' : 'transparent',
                        border: period === p ? '1px solid rgba(200,168,75,0.4)' : '1px solid #1A2D45',
                        color: period === p ? '#C8A84B' : '#7A94B0',
                        fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
                      }}>{p}</button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={history}>
                    <defs>
                      <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={up ? '#00D68F' : '#FF4757'} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={up ? '#00D68F' : '#FF4757'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A2D45" />
                    <XAxis dataKey="date" tick={{ fill: '#3D5470', fontSize: 10, fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis yAxisId="price" domain={['auto', 'auto']} tick={{ fill: '#3D5470', fontSize: 10, fontFamily: 'DM Mono' }} width={65} tickFormatter={v => '₹' + v.toLocaleString()} />
                    <YAxis yAxisId="volume" orientation="right" tick={{ fill: '#3D5470', fontSize: 9, fontFamily: 'DM Mono' }} tickFormatter={v => (v / 1e6).toFixed(0) + 'M'} width={45} />
                    <Tooltip
                      contentStyle={{ background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '6px', fontFamily: 'DM Mono', fontSize: '12px' }}
                      labelStyle={{ color: '#7A94B0' }}
                    />
                    <Bar yAxisId="volume" dataKey="volume" fill="#1A2D45" radius={[2, 2, 0, 0]} />
                    <Area yAxisId="price" type="monotone" dataKey="close" stroke={up ? '#00D68F' : '#FF4757'} strokeWidth={2} fill="url(#stockGrad)" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* AI Analysis */}
              <div style={{ background: '#0D1520', border: '1px solid rgba(200,168,75,0.2)', borderRadius: '10px', padding: '24px' }}>
                <div className="stock-ai-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8A84B', letterSpacing: '0.08em', marginBottom: '4px' }}>◆ BEACON AI ANALYSIS</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#E8EDF5' }}>Claude-Powered Research Report</div>
                  </div>
                  <div className="stock-ai-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select value={aiType} onChange={e => setAiType(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px' }}>
                      <option value="comprehensive">Comprehensive</option>
                      <option value="fundamental">Fundamental</option>
                      <option value="technical">Technical</option>
                    </select>
                    <button className="btn-primary" onClick={runAnalysis} disabled={analysing} style={{ padding: '10px 20px', opacity: analysing ? 0.7 : 1 }}>
                      {analysing ? '◆ Analysing...' : '◆ Generate Report'}
                    </button>
                  </div>
                </div>
                {analysis ? (
                  <div style={{
                    fontSize: '14px', lineHeight: '1.8', color: '#E8EDF5',
                    whiteSpace: 'pre-wrap',
                    padding: '20px',
                    background: '#080D16', borderRadius: '8px', border: '1px solid #1A2D45',
                  }}>
                    {analysis}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#3D5470' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>◆</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Click "Generate Report" for AI-powered analysis</div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
