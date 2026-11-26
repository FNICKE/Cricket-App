import React, { useState, useEffect } from 'react';
import { Activity, Radio, MapPin, Zap, ArrowRight, Shield } from 'lucide-react';

interface ActiveMatch {
  id: number;
  series: string;
  matchNo: string;
  venue: string;
  status: string;
  statusNote: string;
  teamA: { name: string; shortName: string; score: string; overs: string; logo: string };
  teamB: { name: string; shortName: string; score: string; overs: string; logo: string };
  currentRunRate?: number;
  requiredRunRate?: number;
  target?: number;
  ballsRemaining?: number;
  neededRuns?: number;
  isPrimary?: boolean;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function ActiveMatchesPage({ onSelectMatch }: { onSelectMatch?: (id: number) => void }) {
  const [activeMatches, setActiveMatches] = useState<ActiveMatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/active-matches`)
      .then((res) => res.json())
      .then((d) => setActiveMatches(d.matches || []))
      .catch((err) => console.warn('Error fetching active matches:', err))
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      fetch(`${API_BASE}/active-matches`)
        .then((res) => res.json())
        .then((d) => setActiveMatches(d.matches || []))
        .catch(() => {});
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '9999px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
              Live Arena
            </span>
          </div>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Real-time socket synchronized</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '-0.025em' }}>
          Active & In-Progress Matches
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Live cricket matches currently being played across International and Village leagues.
        </p>
      </div>

      {/* Active Matches Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {activeMatches.map((m) => (
          <div
            key={m.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.5rem',
              border: '2px solid #10b981',
              padding: '1.75rem',
              boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              {/* Top Row: Series & Status Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>
                  {m.series}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: '9999px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <span style={{ fontSize: '0.6875rem', fontWeight: 900, color: '#dc2626' }}>
                    {m.status}
                  </span>
                </div>
              </div>

              {/* Match No */}
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '12px' }}>
                {m.matchNo} • {m.venue}
              </div>

              {/* Scores */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '16px 0' }}>
                {/* Team A */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{m.teamA.logo}</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{m.teamA.name}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>{m.teamA.score}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '4px' }}>({m.teamA.overs})</span>
                  </div>
                </div>

                {/* Team B */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{m.teamB.logo}</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{m.teamB.name}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>{m.teamB.score}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '4px' }}>({m.teamB.overs})</span>
                  </div>
                </div>
              </div>

              {/* Live Equation / Target */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '1rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155'
              }}>
                {m.statusNote}
              </div>

              {/* Run Rates Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.25rem', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase' }}>CRR</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: '#0f172a' }}>{m.currentRunRate?.toFixed(2) || '8.88'}</div>
                </div>
                <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase' }}>RRR</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: '#10b981' }}>{m.requiredRunRate?.toFixed(2) || '11.45'}</div>
                </div>
                <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase' }}>Target</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: '#0f172a' }}>{m.target || 187}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectMatch && onSelectMatch(m.id)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Zap size={16} />
              <span>Enter Live Ball-by-Ball Arena</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
