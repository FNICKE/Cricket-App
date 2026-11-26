import React, { useState, useEffect } from 'react';
import { Layers, MapPin, Award, BookOpen, Shield, HelpCircle, ChevronRight } from 'lucide-react';

interface MoreData {
  records: Array<{ title: string; record: string; holder: string; date: string }>;
  venues: Array<{ name: string; city: string; capacity: string; established: string; league?: string }>;
  rules: Array<{ title: string; text: string }>;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function MorePage() {
  const [data, setData] = useState<MoreData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/more`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((err) => console.warn('Error fetching more data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
            Resource Hub
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Records, Grounds & Guidelines</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '-0.025em' }}>
          Cricket Archives & More
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          All-time cricket records, tournament venues, Village League specifications, and official match rules.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Section 1: All-Time Records */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Award size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              All-Time Cricket Records
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.records.map((r, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>{r.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.holder} ({r.date})</div>
                </div>
                <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#10b981' }}>{r.record}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Grounds & Venues */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <MapPin size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Stadiums & Tournament Grounds
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.venues.map((v, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>{v.name}</div>
                  {v.league && (
                    <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px' }}>
                      {v.league}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {v.city} • Capacity: {v.capacity} • Est. {v.established}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Official Tournament Rules */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <BookOpen size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Official Rules & Guidelines
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.rules.map((rule, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  {rule.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
                  {rule.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
