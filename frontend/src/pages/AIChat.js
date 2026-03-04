import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { aiAPI } from '../services/api';

const STARTER_PROMPTS = [
  'Analyze Reliance Industries — give me a buy/sell recommendation',
  'What is the current RBI monetary policy stance and impact on banking stocks?',
  'Explain SEBI\'s latest insider trading regulations',
  'Compare TCS vs Infosys — which is a better investment?',
  'What are the key ratios to look at for NBFC stocks?',
  'Give me a macro outlook for Indian equities in 2025',
];

function Message({ role, content }) {
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '20px 0',
      borderBottom: '1px solid #1A2D45',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '6px', flexShrink: 0,
        background: role === 'user' ? '#1A2D45' : 'rgba(200,168,75,0.2)',
        border: role === 'user' ? '1px solid #1F3550' : '1px solid rgba(200,168,75,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px',
      }}>
        {role === 'user' ? '▽' : '◆'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#7A94B0', marginBottom: '8px', letterSpacing: '0.08em' }}>
          {role === 'user' ? 'YOU' : 'BEACON AI · CLAUDE'}
        </div>
        <div style={{
          fontSize: '14px', lineHeight: '1.75', color: '#E8EDF5',
          whiteSpace: 'pre-wrap',
        }}>
          {content}
        </div>
      </div>
    </div>
  );
}

export default function AIChat() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '◆ Welcome to Beacon AI Terminal — powered by Claude.\n\nI\'m your expert financial analyst for Indian and global markets. Ask me anything about:\n\n• Stock analysis (fundamental & technical)\n• SEBI/RBI regulations and circulars\n• Macro economics and sector outlook\n• Financial statement analysis\n• Portfolio strategy and risk management\n\nWhat would you like to research today?'
  }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode]       = useState('chat');
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
      const res = await aiAPI.chat({ message: msg, history });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Connection error. Please check your API configuration.\n\nError: ' + (err.response?.data?.error || err.message)
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          padding: '16px 32px', borderBottom: '1px solid #1A2D45',
          background: '#080D16', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#E8EDF5' }}>AI Terminal</h2>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', marginTop: '2px' }}>
              Claude · Financial Analysis Engine
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['chat', 'stock-analysis', 'macro'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '6px 14px', borderRadius: '4px',
                background: mode === m ? 'rgba(200,168,75,0.15)' : 'transparent',
                border: mode === m ? '1px solid rgba(200,168,75,0.4)' : '1px solid #1A2D45',
                color: mode === m ? '#C8A84B' : '#7A94B0',
                fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {m.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px' }}>
          {messages.map((m, i) => <Message key={i} {...m} />)}
          {loading && (
            <div style={{ padding: '20px 0', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '6px',
                background: 'rgba(200,168,75,0.2)', border: '1px solid rgba(200,168,75,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
              }}>◆</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#C8A84B',
                    animation: `pulse 1.2s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Starter prompts */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 32px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {STARTER_PROMPTS.map(p => (
              <button key={p} onClick={() => send(p)} style={{
                padding: '8px 14px', borderRadius: '20px',
                background: 'rgba(200,168,75,0.08)', border: '1px solid rgba(200,168,75,0.2)',
                color: '#C8A84B', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,168,75,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,168,75,0.08)'}
              >
                {p.length > 50 ? p.substring(0, 50) + '...' : p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '16px 32px 24px', borderTop: '1px solid #1A2D45', background: '#080D16' }}>
          <div style={{
            display: 'flex', gap: '12px',
            background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '8px', padding: '12px 16px',
          }}>
            <span style={{ color: '#C8A84B', fontFamily: 'var(--font-mono)', fontSize: '14px', paddingTop: '2px' }}>◆</span>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about any stock, sector, regulation, or market trend..."
              rows={2}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#E8EDF5', fontSize: '14px', fontFamily: 'var(--font-body)',
                resize: 'none', lineHeight: '1.6',
              }}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} className="btn-primary" style={{
              alignSelf: 'flex-end', padding: '8px 16px', opacity: loading || !input.trim() ? 0.5 : 1,
            }}>
              Send →
            </button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3D5470', marginTop: '8px', textAlign: 'center' }}>
            ⚠️ AI-generated analysis — not investment advice. Shift+Enter for newline.
          </div>
        </div>
      </div>
    </div>
  );
}
