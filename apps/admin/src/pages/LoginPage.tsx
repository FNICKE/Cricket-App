import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { API_BASE } from '../constants';
import type { AdminSession } from '../types';

export default function LoginPage({ onLogin }: { onLogin: (session: AdminSession) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Sign in failed.');
        return;
      }
      sessionStorage.setItem('scorerDeskToken', data.token);
      onLogin({ token: data.token, user: data.user });
    } catch {
      setError('Could not connect to the scorer service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f8fafc' }}>
      <form onSubmit={submitLogin} style={{ width: 'min(100%, 420px)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px', boxShadow: '0 20px 50px rgba(15, 23, 42, .08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{ background: '#ecfdf5', color: '#059669', padding: '12px', borderRadius: '12px' }}><ShieldCheck size={24} /></div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>TASK<span style={{ color: '#10b981' }}>SCORER</span></div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Secure scorer desk sign in</div>
          </div>
        </div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Email</label>
        <input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', marginBottom: '16px', border: '1px solid #cbd5e1', borderRadius: '9px' }} />
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Password</label>
        <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', marginBottom: '16px', border: '1px solid #cbd5e1', borderRadius: '9px' }} />
        {error && <p role="alert" style={{ color: '#dc2626', fontSize: '0.8125rem' }}>{error}</p>}
        <button disabled={submitting} type="submit" style={{ width: '100%', border: 0, borderRadius: '9px', padding: '12px', color: '#fff', background: '#059669', fontWeight: 800, cursor: submitting ? 'wait' : 'pointer' }}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        <p style={{ margin: '18px 0 0', fontSize: '0.75rem', lineHeight: 1.5, color: '#64748b' }}>Scorer accounts are created by a super administrator. Ask your administrator for your login.</p>
      </form>
    </main>
  );
}
