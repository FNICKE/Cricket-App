import { useEffect, useState } from 'react';
import { API_BASE } from './constants';
import LoginPage from './pages/LoginPage';
import ScorerDeskPage from './pages/ScorerDeskPage';
import type { AdminSession } from './types';

export default function App() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('scorerDeskToken');
    if (!token) {
      setCheckingSession(false);
      return;
    }
    fetch(`${API_BASE}/admin/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error('Session expired');
        const data = await response.json();
        setSession({ token, user: data.user });
      })
      .catch(() => sessionStorage.removeItem('scorerDeskToken'))
      .finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) {
    return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#64748b' }}>Checking scorer session…</main>;
  }
  if (!session) return <LoginPage onLogin={setSession} />;

  return (
    <ScorerDeskPage
      session={session}
      onLogout={() => {
        sessionStorage.removeItem('scorerDeskToken');
        setSession(null);
      }}
    />
  );
}
