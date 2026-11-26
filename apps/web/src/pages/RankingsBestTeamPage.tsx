import React, { useState, useEffect } from 'react';
import { Award, Trophy, Users, Shield, Star, Sparkles, CheckCircle2 } from 'lucide-react';

interface BestPlayer {
  no: number;
  name: string;
  role: string;
  country: string;
  rating: number;
  pos: string;
}

interface RankingsData {
  topRankingCriteria: string;
  teamRankings: Array<{ rank: number; team: string; points: number; rating: number; change: string; badge: string }>;
  battingRankings: Array<{ rank: number; player: string; country: string; rating: number; matches: number; top100Points: number }>;
  bowlingRankings: Array<{ rank: number; player: string; country: string; rating: number; wickets: number; top100Points: number }>;
  bestTeamXI: {
    title: string;
    subtitle: string;
    captain: string;
    wicketKeeper: string;
    coach: string;
    players: BestPlayer[];
  };
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function RankingsBestTeamPage() {
  const [data, setData] = useState<RankingsData | null>(null);
  const [activeTab, setActiveTab] = useState<'best-team' | 'teams' | 'batting' | 'bowling'>('best-team');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/rankings`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((err) => console.warn('Error fetching rankings:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
              Official Rankings & Dream XI
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
              ★ Compulsory 100 Points benchmark for Top Ranking
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '-0.025em' }}>
            Cricket Rankings & Best Team XI
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Official international player ratings plus the World Tournament Best Playing XI showcase.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'best-team', label: '⭐ Best Team XI (Dream XI)' },
            { id: 'teams', label: 'Team Rankings' },
            { id: 'batting', label: 'Batting Rankings' },
            { id: 'bowling', label: 'Bowling Rankings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 800,
                border: activeTab === tab.id ? '1px solid #10b981' : '1px solid #e2e8f0',
                backgroundColor: activeTab === tab.id ? '#10b981' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#475569',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TAB 1: BEST TEAM XI (DREAM PLAYING 11)
      ══════════════════════════════════════════════════ */}
      {activeTab === 'best-team' && data?.bestTeamXI && (
        <div>
          {/* Top Criteria Banner */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '1.25rem',
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={20} fill="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#166534' }}>
                  {data.bestTeamXI.title} (Selected by Top Ranking Criteria)
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#15803d' }}>
                  {data.topRankingCriteria} • Captain: {data.bestTeamXI.captain} • Coach: {data.bestTeamXI.coach}
                </div>
              </div>
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 900, backgroundColor: '#166534', color: '#fff', padding: '4px 12px', borderRadius: '6px' }}>
              TOP 100 RANKED XI
            </span>
          </div>

          {/* Visual Best XI Lineup */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '1.5rem',
            padding: '2rem',
            color: '#ffffff',
            marginBottom: '2rem',
            boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Tactical Pitch Deployment
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '4px 0' }}>
                World & League Best Playing XI
              </h2>
            </div>

            {/* Tactical Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem'
            }}>
              {data.bestTeamXI.players.map((p) => (
                <div
                  key={p.no}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.875rem',
                    flexShrink: 0
                  }}>
                    {p.no}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#34d399', fontWeight: 700 }}>
                      {p.pos} • {p.country}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: '#94a3b8', marginTop: '2px' }}>
                      Rating: <strong>{p.rating}</strong> (Compulsory 100 Qualified)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 2: TEAM RANKINGS
      ══════════════════════════════════════════════════ */}
      {activeTab === 'teams' && data?.teamRankings && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Rank</th>
                <th style={{ padding: '12px 16px' }}>Team</th>
                <th style={{ padding: '12px 16px' }}>Points</th>
                <th style={{ padding: '12px 16px' }}>Rating</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.teamRankings.map((t) => (
                <tr key={t.rank} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 900, color: '#0f172a' }}>#{t.rank}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>{t.team}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{t.points}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 900, color: '#10b981' }}>{t.rating}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '6px' }}>
                      {t.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 3: BATTING RANKINGS
      ══════════════════════════════════════════════════ */}
      {activeTab === 'batting' && data?.battingRankings && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Rank</th>
                <th style={{ padding: '12px 16px' }}>Batter</th>
                <th style={{ padding: '12px 16px' }}>Country</th>
                <th style={{ padding: '12px 16px' }}>Rating</th>
                <th style={{ padding: '12px 16px' }}>Matches</th>
                <th style={{ padding: '12px 16px' }}>Top 100 Ranking Points</th>
              </tr>
            </thead>
            <tbody>
              {data.battingRankings.map((b) => (
                <tr key={b.rank} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 900, color: '#0f172a' }}>#{b.rank}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>{b.player}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{b.country}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 900, color: '#10b981' }}>{b.rating}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{b.matches}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '6px' }}>
                      {b.top100Points} / 100 (Qualified)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 4: BOWLING RANKINGS
      ══════════════════════════════════════════════════ */}
      {activeTab === 'bowling' && data?.bowlingRankings && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Rank</th>
                <th style={{ padding: '12px 16px' }}>Bowler</th>
                <th style={{ padding: '12px 16px' }}>Country</th>
                <th style={{ padding: '12px 16px' }}>Rating</th>
                <th style={{ padding: '12px 16px' }}>Wickets</th>
                <th style={{ padding: '12px 16px' }}>Top 100 Ranking Points</th>
              </tr>
            </thead>
            <tbody>
              {data.bowlingRankings.map((bw) => (
                <tr key={bw.rank} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 900, color: '#0f172a' }}>#{bw.rank}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>{bw.player}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{bw.country}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 900, color: '#10b981' }}>{bw.rating}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{bw.wickets}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '6px' }}>
                      {bw.top100Points} / 100 (Qualified)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
