import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Filter, Trophy, ArrowRight, Zap } from 'lucide-react';

interface MatchFixture {
  id: number;
  series: string;
  matchNo: string;
  teamA: { name: string; shortName: string; logo: string };
  teamB: { name: string; shortName: string; logo: string };
  dateTime: string;
  venue: string;
  format: string;
  status: string;
  category: string;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function SchedulePage({ onSelectMatch }: { onSelectMatch?: (id: number) => void }) {
  const [schedule, setSchedule] = useState<MatchFixture[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/schedule`)
      .then((res) => res.json())
      .then((data) => setSchedule(data.schedule || []))
      .catch((err) => console.warn('Error fetching schedule:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'International', 'Village League', 'League'];

  const filtered = schedule.filter(
    (item) => filterCategory === 'All' || item.category === filterCategory
  );

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
              Official Calendar
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Indian Standard Time (IST)</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '-0.025em' }}>
            Cricket Fixtures & Schedule
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Upcoming fixtures across ICC T20 World Cup, Village Premium League (Panvel Taluka), and IPL.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: filterCategory === cat ? '1px solid #10b981' : '1px solid #e2e8f0',
                backgroundColor: filterCategory === cat ? '#10b981' : '#ffffff',
                color: filterCategory === cat ? '#ffffff' : '#475569',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: item.status === 'LIVE' ? '2px solid #10b981' : '1px solid #f1f5f9',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center'
            }}
          >
            {/* Match Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                  {item.series}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>•</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>{item.matchNo}</span>
                {item.status === 'LIVE' && (
                  <span style={{ fontSize: '0.625rem', fontWeight: 900, backgroundColor: '#ef4444', color: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>
                    LIVE NOW
                  </span>
                )}
              </div>

              {/* Teams Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.teamA.logo}</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a' }}>{item.teamA.name}</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>VS</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.teamB.logo}</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a' }}>{item.teamB.name}</span>
                </div>
              </div>

              {/* Venue & Time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.75rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="#10b981" />
                  <span>{item.dateTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#10b981" />
                  <span>{item.venue}</span>
                </div>
              </div>
            </div>

            {/* Action / Tag */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '6px' }}>
                {item.format}
              </span>

              {item.status === 'LIVE' ? (
                <button
                  onClick={() => onSelectMatch && onSelectMatch(item.id)}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Zap size={14} />
                  <span>Watch Live Ball-by-Ball</span>
                </button>
              ) : (
                <button
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Match Info
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
