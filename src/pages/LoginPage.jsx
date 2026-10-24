import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const StarField = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 4,
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          borderRadius: '50%',
          background: 'rgba(200,210,255,0.7)',
          animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@cloudops.io');
      setPassword('admin123');
    } else {
      setEmail('viewer@cloudops.io');
      setPassword('viewer123');
    }
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <StarField />

      {/* Glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 30% 40%, rgba(91,95,199,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 75% 65%, rgba(176,124,250,0.12) 0%, transparent 55%)
        `,
      }} />

      {/* Login Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '420px',
        maxWidth: '95vw',
        animation: 'fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Card */}
        <div style={{
          background: 'rgba(11,11,36,0.85)',
          border: '1px solid rgba(91,95,199,0.22)',
          borderRadius: '20px',
          padding: '44px 40px',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset',
        }}>
          {/* Logo / Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: 52, height: 52,
              background: 'linear-gradient(135deg, #5b5fc7 0%, #4d9fff 100%)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px',
              margin: '0 auto 18px',
              boxShadow: '0 0 32px rgba(91,95,199,0.45)',
            }}>⚡</div>
            <div style={{ fontSize: '20px', fontWeight: 400, color: '#e8eaf6', letterSpacing: '-0.02em' }}>
              CloudOps Monitor
            </div>
            <div style={{ fontSize: '13px', color: '#5a5f8a', marginTop: '5px', fontWeight: 300 }}>
              Sign in to your workspace
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 500,
                color: '#5a5f8a',
                marginBottom: '7px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@cloudops.io"
                required
                autoComplete="username"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  padding: '10px 13px',
                  fontSize: '14px',
                  color: '#e8eaf6',
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(91,95,199,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(91,95,199,0.14)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 500,
                color: '#5a5f8a',
                marginBottom: '7px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '10px',
                    padding: '10px 40px 10px 13px',
                    fontSize: '14px',
                    color: '#e8eaf6',
                    fontFamily: "'DM Mono', monospace",
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(91,95,199,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(91,95,199,0.14)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#5a5f8a', fontSize: '13px', padding: '0',
                  }}
                >
                  {showPassword ? '○' : '●'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(240,92,122,0.1)',
                border: '1px solid rgba(240,92,122,0.25)',
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '12px',
                color: '#f05c7a',
                marginBottom: '16px',
                fontWeight: 300,
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '11px 20px',
                background: 'linear-gradient(135deg, #5b5fc7 0%, #4d9fff 100%)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s',
                boxShadow: '0 4px 20px rgba(91,95,199,0.35)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!isLoading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 28px rgba(91,95,199,0.5)'; } }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(91,95,199,0.35)'; }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '11px', color: '#3a3f6a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Demo</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Demo Accounts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              id="demo-admin-btn"
              onClick={() => fillDemo('admin')}
              style={{
                background: 'rgba(91,95,199,0.1)',
                border: '1px solid rgba(91,95,199,0.22)',
                borderRadius: '8px',
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'left',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(91,95,199,0.18)'; e.currentTarget.style.borderColor = 'rgba(91,95,199,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(91,95,199,0.1)'; e.currentTarget.style.borderColor = 'rgba(91,95,199,0.22)'; }}
            >
              <div style={{ fontSize: '11px', color: '#8b8fea', fontWeight: 500, marginBottom: '2px', letterSpacing: '0.04em' }}>ADMIN</div>
              <div style={{ fontSize: '11px', color: '#5a5f8a', fontFamily: "'DM Mono', monospace", fontWeight: 300 }}>admin@cloudops.io</div>
            </button>
            <button
              id="demo-viewer-btn"
              onClick={() => fillDemo('viewer')}
              style={{
                background: 'rgba(77,159,255,0.08)',
                border: '1px solid rgba(77,159,255,0.18)',
                borderRadius: '8px',
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'left',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(77,159,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(77,159,255,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(77,159,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(77,159,255,0.18)'; }}
            >
              <div style={{ fontSize: '11px', color: '#4d9fff', fontWeight: 500, marginBottom: '2px', letterSpacing: '0.04em' }}>VIEWER</div>
              <div style={{ fontSize: '11px', color: '#5a5f8a', fontFamily: "'DM Mono', monospace", fontWeight: 300 }}>viewer@cloudops.io</div>
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#3a3f6a', letterSpacing: '0.04em' }}>
          CloudOps Monitor v2.0 · Secure Access
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
