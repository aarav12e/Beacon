import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { circularsAPI, aiAPI } from '../services/api';

const SOURCES = ['ALL', 'SEBI', 'RBI', 'NSE', 'BSE', 'MCA', 'IRDAI'];

function CircularCard({ item, onSummarise }) {
  const impactColors = { high: '#FF4757', medium: '#C8A84B', low: '#00D68F' };
  return (
    <div style={{
      background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '10px', padding: '20px',
      marginBottom: '12px', transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = '#1F3550'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#1A2D45'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 8px',
              background: item.source === 'SEBI' ? 'rgba(200,168,75,0.15)' : item.source === 'RBI' ? 'rgba(0,212,255,0.1)' : 'rgba(0,214,143,0.1)',
              color: item.source === 'SEBI' ? '#C8A84B' : item.source === 'RBI' ? '#00D4FF' : '#00D68F',
              border: `1px solid ${item.source === 'SEBI' ? 'rgba(200,168,75,0.3)' : item.source === 'RBI' ? 'rgba(0,212,255,0.2)' : 'rgba(0,214,143,0.2)'}`,
              borderRadius: '2px', letterSpacing: '0.08em',
            }}>
              {item.source}
            </span>
            {item.impactLevel && (
              <span className={`tag tag-${item.impactLevel}`}>{item.impactLevel} impact</span>
            )}
            {item.circularNo && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3D5470' }}>{item.circularNo}</span>
            )}
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#E8EDF5', lineHeight: '1.4', marginBottom: '8px' }}>{item.title}</h3>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3D5470' }}>
            {new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <button onClick={() => onSummarise(item)} style={{
          padding: '6px 14px', borderRadius: '4px',
          background: 'rgba(200,168,75,0.1)', border: '1px solid rgba(200,168,75,0.3)',
          color: '#C8A84B', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
          whiteSpace: 'nowrap', marginLeft: '16px',
          transition: 'all 0.2s',
        }}>
          ◆ AI Summary
        </button>
      </div>

      {item.aiSummary && (
        <div style={{
          background: '#080D16', border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: '6px', padding: '14px',
          fontSize: '13px', color: '#7A94B0', lineHeight: '1.7',
        }}>
          <span style={{ color: '#C8A84B', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600 }}>◆ AI SUMMARY · </span>
          {item.aiSummary}
        </div>
      )}

      {item.sectors?.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
          {item.sectors.map(s => (
            <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 8px', background: '#111D2E', color: '#7A94B0', borderRadius: '2px', border: '1px solid #1A2D45' }}>
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Circulars() {
  const [circulars, setCirculars] = useState([]);
  const [filter, setFilter]       = useState('ALL');
  const [loading, setLoading]     = useState(true);
  const [items, setItems]         = useState([]);

  useEffect(() => {
    circularsAPI.getAll({ source: filter === 'ALL' ? undefined : filter })
      .then(res => setCirculars(res.data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { setItems(circulars); }, [circulars]);

  const summarise = async (circular) => {
    if (circular.aiSummary) return;
    try {
      const res = await aiAPI.summarizeCircular({
        text: circular.body || circular.title + ' — regulatory update',
        source: circular.source,
        title: circular.title,
      });
      setItems(prev => prev.map(c => c._id === circular._id ? { ...c, aiSummary: res.data.summary } : c));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, overflowX: 'hidden' }}>
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #1A2D45', background: '#080D16' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#E8EDF5', marginBottom: '4px' }}>Regulatory Intelligence</h2>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', marginBottom: '16px' }}>
            SEBI · RBI · NSE · BSE · MCA Circulars — AI Summarised
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {SOURCES.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '6px 14px', borderRadius: '3px',
                background: filter === s ? 'rgba(200,168,75,0.15)' : 'rgba(255,255,255,0.03)',
                border: filter === s ? '1px solid rgba(200,168,75,0.4)' : '1px solid #1A2D45',
                color: filter === s ? '#C8A84B' : '#7A94B0',
                fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 32px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#7A94B0' }}>Loading circulars...</div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#3D5470' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>▣</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>No circulars found</div>
            </div>
          ) : (
            items.map((item, i) => <CircularCard key={item._id || i} item={item} onSummarise={summarise} />)
          )}
        </div>
      </div>
    </div>
  );
}
