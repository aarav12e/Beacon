import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { researchAPI } from '../services/api';

const TYPES = ['all', 'fundamental', 'technical', 'macro', 'sector', 'custom'];
const REC_COLORS = { buy: '#00D68F', sell: '#FF4757', hold: '#C8A84B', watch: '#00D4FF' };

export default function ResearchPage() {
  const [items, setItems]     = useState([]);
  const [filter, setFilter]   = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    researchAPI.getAll(filter !== 'all' ? { type: filter } : {})
      .then(res => setItems(res.data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const deleteItem = async (id) => {
    await researchAPI.delete(id);
    setItems(prev => prev.filter(i => i._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* List panel */}
        <div style={{ width: '340px', borderRight: '1px solid #1A2D45', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1A2D45', background: '#080D16' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#E8EDF5', marginBottom: '12px' }}>Research Library</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setFilter(t)} style={{
                  padding: '4px 10px', borderRadius: '3px', border: filter === t ? '1px solid rgba(200,168,75,0.4)' : '1px solid #1A2D45',
                  background: filter === t ? 'rgba(200,168,75,0.12)' : 'transparent',
                  color: filter === t ? '#C8A84B' : '#7A94B0', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? <div style={{ textAlign: 'center', padding: '40px', color: '#7A94B0' }}>Loading...</div> :
             items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#3D5470' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>◇</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>No research saved yet</div>
                <div style={{ fontSize: '12px', color: '#3D5470', marginTop: '6px' }}>Generate reports in the AI Terminal or Stock Research pages</div>
              </div>
             ) : items.map(item => (
              <div
                key={item._id}
                onClick={() => setSelected(item)}
                style={{
                  padding: '16px 20px', borderBottom: '1px solid #1A2D45', cursor: 'pointer',
                  background: selected?._id === item._id ? 'rgba(200,168,75,0.06)' : 'transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (selected?._id !== item._id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={e => { if (selected?._id !== item._id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 6px', background: '#111D2E', color: '#7A94B0', borderRadius: '2px', textTransform: 'uppercase' }}>
                    {item.type}
                  </span>
                  {item.recommendation && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                      color: REC_COLORS[item.recommendation], letterSpacing: '0.06em',
                    }}>
                      {item.recommendation.toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EDF5', marginBottom: '4px', lineHeight: '1.3' }}>{item.title}</div>
                <div style={{ fontSize: '11px', color: '#3D5470', fontFamily: 'var(--font-mono)' }}>
                  {new Date(item.createdAt).toLocaleDateString('en-IN')}
                  {item.symbol && ` · ${item.symbol}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {selected ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '3px 8px', background: '#111D2E', color: '#7A94B0', borderRadius: '2px', textTransform: 'uppercase' }}>
                      {selected.type}
                    </span>
                    {selected.symbol && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '3px 8px', background: 'rgba(200,168,75,0.1)', color: '#C8A84B', borderRadius: '2px', border: '1px solid rgba(200,168,75,0.2)' }}>
                        {selected.symbol} · {selected.exchange}
                      </span>
                    )}
                    {selected.recommendation && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: REC_COLORS[selected.recommendation] }}>
                        {selected.recommendation.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#E8EDF5', marginBottom: '6px' }}>{selected.title}</h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3D5470' }}>
                    {new Date(selected.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <button onClick={() => deleteItem(selected._id)} style={{
                  padding: '8px 14px', borderRadius: '4px', background: 'rgba(255,71,87,0.1)',
                  border: '1px solid rgba(255,71,87,0.3)', color: '#FF4757', fontSize: '12px', cursor: 'pointer',
                }}>Delete</button>
              </div>

              <div style={{
                background: '#0D1520', border: '1px solid rgba(200,168,75,0.15)',
                borderRadius: '10px', padding: '24px',
                fontSize: '14px', lineHeight: '1.8', color: '#E8EDF5',
                whiteSpace: 'pre-wrap',
              }}>
                {selected.aiSummary || selected.content || 'No content available.'}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px', color: '#3D5470' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>◇</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#7A94B0', marginBottom: '8px' }}>Select a report</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Click any research item from the list</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
