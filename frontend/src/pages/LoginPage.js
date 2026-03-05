import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * LoginPage — renders Clerk's polished SignIn or SignUp component
 * styled to match Beacon's dark financial aesthetic.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.search.includes('mode=signup');

  const appearance = {
    variables: {
      colorPrimary: '#C8A84B',
      colorBackground: '#0D1520',
      colorInputBackground: '#080D16',
      colorInputText: '#E8EDF5',
      colorText: '#E8EDF5',
      colorTextSecondary: '#7A94B0',
      colorDanger: '#FF4757',
      colorSuccess: '#00D68F',
      borderRadius: '8px',
      fontFamily: "'Syne', sans-serif",
      fontSize: '14px',
    },
    elements: {
      rootBox: 'clerk-root',
      card: 'clerk-card',
      headerTitle: { fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '24px', color: '#E8EDF5' },
      headerSubtitle: { color: '#7A94B0', fontFamily: "'DM Mono', monospace", fontSize: '12px' },
      socialButtonsBlockButton: {
        background: '#111D2E',
        border: '1px solid #1A2D45',
        color: '#E8EDF5',
      },
      dividerLine: { background: '#1A2D45' },
      dividerText: { color: '#3D5470' },
      formFieldInput: { background: '#080D16', border: '1px solid #1A2D45', color: '#E8EDF5' },
      formFieldLabel: { color: '#7A94B0', fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.08em' },
      formButtonPrimary: { background: '#C8A84B', color: '#04060A', fontWeight: '700' },
      footerActionLink: { color: '#C8A84B' },
      identityPreviewText: { color: '#E8EDF5' },
      formResendCodeLink: { color: '#C8A84B' },
    },
  };

  return (
    <div
      data-barba="container"
      data-barba-namespace="login"
      style={{
        minHeight: '100vh',
        background: 'var(--black)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
      }}
    >
      {/* Background grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C8A84B" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(200,168,75,0.08) 0%, transparent 70%)',
      }} />

      {/* Logo above the card */}
      <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
          <svg width="32" height="32" viewBox="0 0 28 28">
            <polygon points="14,2 26,26 2,26" fill="none" stroke="#C8A84B" strokeWidth="2" />
            <polygon points="14,8 22,24 6,24" fill="#C8A84B" opacity="0.2" />
            <line x1="14" y1="2" x2="14" y2="26" stroke="#C8A84B" strokeWidth="1" opacity="0.5" />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#E8EDF5' }}>Beacon</span>
        </div>
        <p style={{ color: '#7A94B0', fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
          FINANCIAL INTELLIGENCE PLATFORM
        </p>
      </div>

      {/* Clerk component */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {isSignUp ? (
          <SignUp
            appearance={appearance}
            afterSignUpUrl="/dashboard"
            redirectUrl="/dashboard"
          />
        ) : (
          <SignIn
            appearance={appearance}
            afterSignInUrl="/dashboard"
            redirectUrl="/dashboard"
          />
        )}
      </div>

      {/* Toggle sign-in / sign-up */}
      <p style={{ marginTop: '20px', color: '#3D5470', fontSize: '13px', position: 'relative', zIndex: 1, fontFamily: 'var(--font-mono)' }}>
        {isSignUp ? (
          <>Already have an account?{' '}
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#C8A84B', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
              Sign in
            </button>
          </>
        ) : (
          <>New to Beacon?{' '}
            <button onClick={() => navigate('/login?mode=signup')} style={{ background: 'none', border: 'none', color: '#C8A84B', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
              Create account
            </button>
          </>
        )}
      </p>

      <style>{`
        .clerk-card {
          box-shadow: 0 24px 60px rgba(0,0,0,0.6) !important;
          border: 1px solid #1A2D45 !important;
        }
        .cl-internal-b3fm6y { display: none; }
      `}</style>
    </div>
  );
}
