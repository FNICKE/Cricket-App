import { useState, type FormEvent } from 'react';
import { RefreshCw } from 'lucide-react';
import { API_BASE } from '../constants';
import type { AdminOverview } from '../types';

interface SuperAdminPageProps {
  overview: AdminOverview | null;
  overviewError: string;
  sessionToken: string;
  onRefresh: () => void;
}

export default function SuperAdminPage({ overview, overviewError, sessionToken, onRefresh }: SuperAdminPageProps) {
  const [scorerName, setScorerName] = useState('');
  const [scorerEmail, setScorerEmail] = useState('');
  const [scorerPassword, setScorerPassword] = useState('');
  const [scorerMessage, setScorerMessage] = useState('');
  const fetchOverview = onRefresh;
  const authHeaders = { Authorization: 'Bearer ' + sessionToken };

  const createScorer = async (event: FormEvent) => {
    event.preventDefault();
    setScorerMessage('');
    try {
      const res = await fetch(API_BASE + '/admin/auth/scorers', {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: scorerName, email: scorerEmail, password: scorerPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setScorerMessage(data.message || 'Could not create scorer account.');
        return;
      }
      setScorerMessage('Scorer login created for ' + data.scorer.email + '.');
      setScorerName('');
      setScorerEmail('');
      setScorerPassword('');
      fetchOverview();
    } catch {
      setScorerMessage('Could not connect to the scorer service.');
    }
  };

  return (
        <main style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 2.5vw, 1.75rem) clamp(0.75rem, 3.5vw, 2rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>SUPER ADMINISTRATION</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '4px 0', color: '#0f172a' }}>Platform status</h1>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>Review match and scorer-account status, and create scorer logins.</p>
            </div>
            <button onClick={fetchOverview} style={{ display: 'flex', alignItems: 'center', gap: '7px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', padding: '9px 13px', fontWeight: 700, cursor: 'pointer' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {overviewError && <p role="alert" style={{ color: '#dc2626', background: '#fef2f2', padding: '12px', borderRadius: '8px' }}>{overviewError}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Scorer accounts', value: overview?.scorers.length ?? '—' },
              { label: 'Registered players', value: overview?.registrations.total ?? '—' },
              { label: 'Paid registrations', value: overview?.registrations.paid ?? '—' },
              { label: 'Pending registrations', value: overview?.registrations.pending ?? '—' },
              { label: 'Expired memberships', value: overview?.registrations.expired ?? '—' }
            ].map((item) => (
              <div key={item.label} className="tv-card" style={{ padding: '16px' }}>
                <p style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px' }}>{item.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>

          <section className="tv-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1rem', margin: '0 0 14px', color: '#0f172a' }}>Match status</h2>
            {overview?.matches.length ? (
              <div style={{ display: 'grid', gap: '10px' }}>
                {overview.matches.map((item) => (
                  <div key={item.matchId} style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 1fr) minmax(160px, 1fr) auto', alignItems: 'center', gap: '14px', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                    <div>
                      <strong style={{ color: '#0f172a' }}>{item.matchNo}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>{item.series}</div>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#334155' }}>{item.teamA.shortName} {item.teamA.score} &nbsp;·&nbsp; {item.teamB.shortName} {item.teamB.score}</div>
                    <span style={{ background: item.status.toLowerCase() === 'live' ? '#dcfce7' : '#f1f5f9', color: item.status.toLowerCase() === 'live' ? '#15803d' : '#475569', borderRadius: '999px', padding: '5px 10px', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase' }}>{item.status}</span>
                    {item.statusNote && <div style={{ gridColumn: '1 / -1', fontSize: '0.75rem', color: '#64748b' }}>{item.statusNote}</div>}
                  </div>
                ))}
              </div>
            ) : <p style={{ color: '#64748b' }}>Loading match statuses…</p>}
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 0.9fr) minmax(380px, 1.1fr)', gap: '20px', alignItems: 'start' }}>
            <form onSubmit={createScorer} className="tv-card" style={{ padding: '20px', display: 'grid', gap: '10px' }}>
              <h2 style={{ fontSize: '1rem', margin: '0 0 4px', color: '#0f172a' }}>Create scorer login</h2>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Full name</label>
              <input required value={scorerName} onChange={(event) => setScorerName(event.target.value)} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Email</label>
              <input required type="email" value={scorerEmail} onChange={(event) => setScorerEmail(event.target.value)} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Temporary password (minimum 12 characters)</label>
              <input required minLength={12} type="password" value={scorerPassword} onChange={(event) => setScorerPassword(event.target.value)} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
              <button type="submit" style={{ background: '#059669', color: '#fff', border: 0, borderRadius: '8px', padding: '11px', fontWeight: 800, cursor: 'pointer' }}>Create scorer account</button>
              {scorerMessage && <p role="status" style={{ color: scorerMessage.startsWith('Scorer login') ? '#047857' : '#dc2626', fontSize: '0.75rem', margin: 0 }}>{scorerMessage}</p>}
            </form>

            <section className="tv-card" style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '1rem', margin: '0 0 14px', color: '#0f172a' }}>Scorer accounts</h2>
              {!overview ? <p style={{ color: '#64748b' }}>Loading scorer accounts…</p> : overview.scorers.length === 0 ? <p style={{ color: '#64748b' }}>No scorer logins created yet.</p> : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                    <thead><tr style={{ color: '#64748b' }}><th style={{ padding: '9px' }}>Scorer</th><th style={{ padding: '9px' }}>Email</th><th style={{ padding: '9px' }}>Status</th></tr></thead>
                    <tbody>{overview.scorers.map((scorer) => (
                      <tr key={scorer.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 9px', fontWeight: 700 }}>{scorer.fullName}</td>
                        <td style={{ padding: '10px 9px' }}>{scorer.email}</td>
                        <td style={{ padding: '10px 9px', color: scorer.isActive ? '#047857' : '#dc2626', fontWeight: 700 }}>{scorer.isActive ? 'Active' : 'Disabled'}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </main>
  );
}
