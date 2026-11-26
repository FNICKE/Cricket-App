import React, { useState, useEffect } from 'react';
import { Award, Calendar, MapPin, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

interface RecentMatch {
  id: number;
  series: string;
  matchNo: string;
  venue: string;
  date: string;
  teamA: { name: string; shortName: string; score: string; overs: string; logo: string };
  teamB: { name: string; shortName: string; score: string; overs: string; logo: string };
  result: string;
  pom: string;
  summary: string;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function RecentMatchesPage({ onSelectMatch }: { onSelectMatch?: (id: number) => void }) {
  const [matches, setMatches] = useState<RecentMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<RecentMatch | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/recent-matches`)
      .then((res) => res.json())
      .then((d) => setMatches(d.matches || []))
      .catch((err) => console.warn('Error fetching recent matches:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
            Results Centre
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Latest Completed Fixtures</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '-0.025em' }}>
          Recent Matches & Results
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Detailed match scorecards, Player of the Match awards, and victory margins.
        </p>
      </div>

      {/* Matches Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {matches.map((m) => (
          <div
            key={m.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid #f1f5f9',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                  {m.series}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{m.date}</span>
              </div>

              {/* Team Scores */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{m.teamA.logo}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{m.teamA.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a' }}>{m.teamA.score}</span>
                    <span style={{ fontSize: '0.6875rem', color: '#64748b', marginLeft: '4px' }}>({m.teamA.overs} ov)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{m.teamB.logo}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{m.teamB.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a' }}>{m.teamB.score}</span>
                    <span style={{ fontSize: '0.6875rem', color: '#64748b', marginLeft: '4px' }}>({m.teamB.overs} ov)</span>
                  </div>
                </div>
              </div>

              {/* Match Result Banner */}
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#047857',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 800,
                marginBottom: '12px'
              }}>
                {m.result}
              </div>

              {/* Player of the match */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#475569', marginBottom: '12px' }}>
                <Award size={14} color="#10b981" />
                <span>Player of the Match: <strong>{m.pom}</strong></span>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                {m.summary}
              </p>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{m.venue}</span>
              <button
                onClick={() => setSelectedMatch(m)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Eye size={13} />
                <span>Scorecard</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scorecard Modal */}
      {selectedMatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {selectedMatch.teamA.name} vs {selectedMatch.teamB.name}
              </h3>
              <button onClick={() => setSelectedMatch(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: '#ecfdf5', padding: '10px 14px', borderRadius: '8px', color: '#047857', fontWeight: 800, fontSize: '0.875rem', marginBottom: '1rem' }}>
              {selectedMatch.result}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem', fontSize: '0.8125rem' }}>
              <div><strong>1st Innings:</strong> {selectedMatch.teamA.name} — {selectedMatch.teamA.score} ({selectedMatch.teamA.overs} ov)</div>
              <div><strong>2nd Innings:</strong> {selectedMatch.teamB.name} — {selectedMatch.teamB.score} ({selectedMatch.teamB.overs} ov)</div>
              <div><strong>Player of the Match:</strong> {selectedMatch.pom}</div>
              <div><strong>Venue:</strong> {selectedMatch.venue}</div>
            </div>

            <button
              onClick={() => setSelectedMatch(null)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
