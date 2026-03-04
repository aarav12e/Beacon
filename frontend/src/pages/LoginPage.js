import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'analyst' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register }   = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password, form.role);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background chart lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C8A84B" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div style={{ position: 'absolute', top: '30%', left: '30%', width: '600px', height: '600px',
        background: 'radial-gradient(ellipse, rgba(200,168,75,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />

      <div style={{ width: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 28 28">
              <polygon points="14,2 26,26 2,26" fill="none" stroke="#C8A84B" strokeWidth="2" />
              <polygon points="14,8 22,24 6,24" fill="#C8A84B" opacity="0.2" />
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#E8EDF5' }}>Beacon</span>
          </div>
          <p style={{ color: '#7A94B0', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>FINANCIAL INTELLIGENCE PLATFORM</p>
        </div>

        <div style={{
          background: '#0D1520',
          border: '1px solid #1A2D45',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: '32px', borderBottom: '1px solid #1A2D45' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '12px', background: 'none', border: 'none',
                color: mode === m ? '#C8A84B' : '#7A94B0',
                borderBottom: mode === m ? '2px solid #C8A84B' : '2px solid transparent',
                fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ fontSize: '11px', color: '#7A94B0', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
                <input
                  type="text" placeholder="Arjun Sharma" required
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '11px', color: '#7A94B0', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>EMAIL</label>
              <input
                type="email" placeholder="analyst@firm.com" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#7A94B0', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
              <input
                type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                style={{ width: '100%' }}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label style={{ fontSize: '11px', color: '#7A94B0', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>ROLE</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{ width: '100%' }}>
                  <option value="analyst">Research Analyst</option>
                  <option value="trader">Trader</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            {error && (
              <div style={{
                background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)',
                borderRadius: '6px', padding: '12px 16px',
                color: '#FF4757', fontSize: '13px',
              }}>{error}</div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: '14px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Enter Beacon →' : 'Create Account →'}
            </button>
          </form>

          {/* Demo note */}
          <p style={{ textAlign: 'center', color: '#3D5470', fontSize: '12px', marginTop: '24px', fontFamily: 'var(--font-mono)' }}>
            Demo: any email + 6+ char password
          </p>
        </div>
      </div>
    </div>
  );
}
