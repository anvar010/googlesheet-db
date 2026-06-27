'use client';

import { useState } from 'react';
import { Icon } from '@/components/ds/Icon';

const USERS_TABLE = [
  { id: 1, email: 'mayank@ivhub.com', password: 'admin123', name: 'Mayank Dutt', role: 'Admin' },
  { id: 2, email: 'media@ivhub.com', password: 'media123', name: 'Media Team', role: 'Viewer' },
  { id: 3, email: 'ops@ivhub.com', password: 'ops123', name: 'Operations', role: 'Manager' },
];

export interface AppUser { id: number; name: string; email: string; role: string; }

export function LoginScreen({ onLogin }: { onLogin: (u: AppUser) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = USERS_TABLE.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
      if (user) onLogin({ id: user.id, name: user.name, email: user.email, role: user.role });
      else setError('Invalid email or password');
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-inverse)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(194,161,91,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(134,190,176,0.06) 0%, transparent 70%)' }} />
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: 420, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://ivhub.com/assets/img/logo/logo_white.png" alt="IV Hub" style={{ height: 44, objectFit: 'contain', marginBottom: 20 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; const next = e.currentTarget.nextElementSibling as HTMLElement; if (next) next.style.display = 'block'; }} />
          <div style={{ display: 'none', fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 600, color: 'var(--ivory)', marginBottom: 20 }}>
            IV <span style={{ color: 'var(--gold-400)' }}>Hub</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--ivory)', fontWeight: 500, letterSpacing: '-0.01em' }}>Sales Dashboard</div>
          <div style={{ fontSize: 13, color: 'var(--text-on-dark-muted)', marginTop: 6 }}>IV Wellness Lounge · Dubai</div>
        </div>
        <form onSubmit={handleSubmit} style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', padding: '36px 32px 32px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 4 }}>Sign in</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Enter your credentials to access the dashboard</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6, letterSpacing: '0.02em' }}>Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="you@ivhub.com" required autoFocus autoComplete="email"
              style={{ width: '100%', height: 44, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', color: 'var(--text-strong)', background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 180ms' }}
              onFocus={e => { e.target.style.borderColor = 'var(--gold-400)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6, letterSpacing: '0.02em' }}>Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="Enter your password" required autoComplete="current-password"
              style={{ width: '100%', height: 44, padding: '0 14px', fontSize: 14, fontFamily: 'var(--font-sans)', color: 'var(--text-strong)', background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 180ms' }}
              onFocus={e => { e.target.style.borderColor = 'var(--gold-400)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; }} />
          </div>
          {error && (
            <div style={{ fontSize: 13, color: 'var(--negative)', background: 'var(--negative-soft)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="alert-circle" size={15} /> {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={{
            width: '100%', height: 46, border: 'none', borderRadius: 'var(--radius-md)',
            background: loading ? 'var(--gold-300)' : 'var(--gold-500)', color: 'var(--surface-inverse)', fontSize: 14.5, fontWeight: 700,
            fontFamily: 'var(--font-sans)', cursor: loading ? 'wait' : 'pointer', letterSpacing: '0.03em', transition: 'background 180ms, transform 100ms',
          }}
            onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--gold-600)'; }}
            onMouseLeave={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--gold-500)'; }}
            onMouseDown={e => { (e.target as HTMLElement).style.transform = 'scale(0.985)'; }}
            onMouseUp={e => { (e.target as HTMLElement).style.transform = 'none'; }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 28, fontSize: 11.5, color: 'var(--text-on-dark-muted)', lineHeight: 1.6 }}>
          Access is restricted to authorized personnel only.<br />Contact your administrator for credentials.
        </div>
      </div>
    </div>
  );
}
