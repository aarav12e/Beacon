import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '◈', label: 'Dashboard' },
  { path: '/stocks',    icon: '△', label: 'Markets' },
  { path: '/ai-chat',  icon: '◆', label: 'AI Terminal' },
  { path: '/research', icon: '◇', label: 'Research' },
  { path: '/circulars',icon: '▣', label: 'Regulators' },
  { path: '/excel',    icon: '⬡', label: 'Excel Agent' },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();

  return (
    <div style={{
      width: '220px', minHeight: '100vh', flexShrink: 0,
      background: '#080D16',
      borderRight: '1px solid #1A2D45',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #1A2D45' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 28 28">
            <polygon points="14,2 26,26 2,26" fill="none" stroke="#C8A84B" strokeWidth="2" />
            <polygon points="14,8 22,24 6,24" fill="#C8A84B" opacity="0.3" />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#E8EDF5' }}>Beacon</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#3D5470', marginTop: '4px', letterSpacing: '0.1em' }}>
          FINANCIAL INTELLIGENCE
        </div>
      </div>

      {/* Live indicator */}
      <div style={{
        margin: '12px 16px',
        padding: '8px 12px',
        background: 'rgba(0,214,143,0.08)',
        border: '1px solid rgba(0,214,143,0.2)',
        borderRadius: '6px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D68F', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#00D68F' }}>MARKETS LIVE</span>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 12px', flex: 1 }}>
        <div style={{ fontSize: '10px', color: '#3D5470', fontFamily: 'var(--font-mono)', padding: '8px 8px 6px', letterSpacing: '0.1em' }}>
          NAVIGATION
        </div>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '6px', marginBottom: '2px',
              background: active ? 'rgba(200,168,75,0.12)' : 'transparent',
              border: active ? '1px solid rgba(200,168,75,0.25)' : '1px solid transparent',
              color: active ? '#C8A84B' : '#7A94B0',
              fontSize: '13px', fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#E8EDF5'; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7A94B0'; } }}
            >
              <span style={{ fontSize: '14px', width: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '16px', borderTop: '1px solid #1A2D45' }}>
        <div style={{ marginBottom: '12px', padding: '12px', background: '#0D1520', borderRadius: '8px', border: '1px solid #1A2D45' }}>
          <div style={{ fontSize: '13px', color: '#E8EDF5', fontWeight: 600, marginBottom: '2px' }}>
            {user?.name || 'Analyst'}
          </div>
          <div style={{ fontSize: '11px', color: '#7A94B0', fontFamily: 'var(--font-mono)' }}>
            {user?.role?.toUpperCase() || 'ANALYST'}
          </div>
        </div>
        <button onClick={logout} className="btn-ghost" style={{ width: '100%', fontSize: '12px', color: '#FF4757' }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
