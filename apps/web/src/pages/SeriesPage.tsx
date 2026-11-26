import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Users, Award, ChevronRight, Zap } from 'lucide-react';

interface SeriesItem {
  id: string;
  name: string;
  host: string;
  dates: string;
  format: string;
  totalTeams: number;
  totalMatches: number;
  currentStage: string;
  topBatter?: string;
  topBowler?: string;
  status: string;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function SeriesPage() {
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/series`)
      .then((r) => r.json())
      .then((d) => setSeriesList(d.series || []))
      .catch((err) => console.warn('Error fetching series:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
            Tournament Hub
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>International, Domestic & Grassroots</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '-0.025em' }}>
          Series & Tournaments
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Follow ongoing tournaments, fixtures, points tables, and series statistics.
        </p>
      </div>

      {/* Series Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {seriesList.map((s) => (
          <div
            key={s.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.5rem',
              border: s.status === 'Active' ? '2px solid #10b981' : '1px solid #f1f5f9',
              padding: '1.75rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: s.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: s.status === 'Active' ? '#10b981' : '#64748b'
                }}>
                  <Trophy size={22} />
                </div>

                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  backgroundColor: s.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                  color: s.status === 'Active' ? '#047857' : '#64748b',
                  border: `1px solid ${s.status === 'Active' ? '#a7f3d0' : '#e2e8f0'}`,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase'
                }}>
                  {s.status}
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 6px 0' }}>
                {s.name}
              </h2>

              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '14px' }}>
                Organized by <strong>{s.host}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '14px', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontSize: '0.625rem' }}>Format</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{s.format}</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontSize: '0.625rem' }}>Dates</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{s.dates}</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontSize: '0.625rem' }}>Teams / Matches</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{s.totalTeams} Teams • {s.totalMatches} Games</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontSize: '0.625rem' }}>Stage</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>{s.currentStage}</span>
                </div>
              </div>

              {s.topBatter && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: '#475569', marginBottom: '1rem' }}>
                  <div>🏏 Top Batter: <strong>{s.topBatter}</strong></div>
                  <div>🎯 Top Bowler: <strong>{s.topBowler}</strong></div>
                </div>
              )}
            </div>

            <button
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>View Series Details & Standings</span>
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
