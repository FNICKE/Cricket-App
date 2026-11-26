import React, { useState, useEffect } from 'react';
import { Users, Shield, Award, UserCheck, Eye, ChevronRight } from 'lucide-react';

interface TeamInfo {
  id: number;
  name: string;
  shortName: string;
  type: string;
  country?: string;
  taluka?: string;
  association?: string;
  village?: string;
  captain: string;
  coach: string;
  logo: string;
  color: string;
  played: number;
  won: number;
  lost: number;
  ranking: number;
  squad15: string[];
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [filterType, setFilterType] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/teams`)
      .then((r) => r.json())
      .then((d) => setTeams(d.teams || []))
      .catch((err) => console.warn('Error fetching teams:', err))
      .finally(() => setLoading(false));
  }, []);

  const types = ['All', 'International', 'Village League'];

  const filteredTeams = teams.filter((t) => filterType === 'All' || t.type === filterType);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
              Teams Roster
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>National Squads & Village Franchises</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '-0.025em' }}>
            Cricket Teams Directory
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Official rosters with full 15-player squad (11 Playing XI + 4 Reserves), captain, and coach details.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: filterType === type ? '1px solid #10b981' : '1px solid #e2e8f0',
                backgroundColor: filterType === type ? '#10b981' : '#ffffff',
                color: filterType === type ? '#ffffff' : '#475569',
                cursor: 'pointer'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredTeams.map((t) => (
          <div
            key={t.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.5rem',
              border: '1px solid #f1f5f9',
              padding: '1.75rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2.25rem' }}>{t.logo}</span>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      {t.name}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {t.type} {t.taluka && `• ${t.taluka} Taluka`}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '6px' }}>
                  Rank #{t.ranking}
                </span>
              </div>

              {/* Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '10px', textAlign: 'center', marginBottom: '14px', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.625rem', textTransform: 'uppercase' }}>Played</span>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{t.played}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.625rem', textTransform: 'uppercase' }}>Won</span>
                  <div style={{ fontWeight: 800, color: '#10b981' }}>{t.won}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.625rem', textTransform: 'uppercase' }}>Lost</span>
                  <div style={{ fontWeight: 800, color: '#ef4444' }}>{t.lost}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '14px', lineHeight: 1.6 }}>
                <div>Captain: <strong>{t.captain}</strong></div>
                <div>Coach: <strong>{t.coach}</strong></div>
                <div>Squad Size: <strong>15 Registered Players</strong> (11 Playing + 4 Reserves)</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTeam(t)}
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
              <Eye size={14} />
              <span>View Official 15-Player Squad</span>
            </button>
          </div>
        ))}
      </div>

      {/* Squad Modal */}
      {selectedTeam && (
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
            borderRadius: '1.5rem',
            padding: '1.75rem',
            maxWidth: '580px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '2rem' }}>{selectedTeam.logo}</span>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    {selectedTeam.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    15-Player Official Squad
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '8px 12px' }}>#</th>
                    <th style={{ padding: '8px 12px' }}>Player Name</th>
                    <th style={{ padding: '8px 12px' }}>Role / Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTeam.squad15.map((player, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: i >= 11 ? '#fffbeb' : '#ffffff'
                      }}
                    >
                      <td style={{ padding: '8px 12px', fontWeight: 700 }}>{i + 1}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>{player}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          backgroundColor: i >= 11 ? '#fef3c7' : '#ecfdf5',
                          color: i >= 11 ? '#b45309' : '#047857',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {i >= 11 ? 'B-Reserve' : 'A-Playing XI'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setSelectedTeam(null)}
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
              Close Squad List
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
