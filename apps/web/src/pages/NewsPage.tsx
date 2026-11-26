import React, { useState, useEffect } from 'react';
import { Newspaper, Clock, User, ChevronRight, Share2, Eye } from 'lucide-react';

interface NewsArticle {
  id: number;
  category: string;
  title: string;
  date: string;
  author: string;
  image: string;
  readTime: string;
  excerpt: string;
  content?: string;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [filterCat, setFilterCat] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/news`)
      .then((r) => r.json())
      .then((d) => setNews(d.news || []))
      .catch((err) => console.warn('Error fetching news:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'World Cup 2026', 'Village Premium League', 'Tactical Analysis', 'IPL 2026'];

  const filteredNews = news.filter((n) => filterCat === 'All' || n.category === filterCat);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
              Cricket Chronicle
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Editorial & Breaking Stories</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '-0.025em' }}>
            Cricket News & Deep Analysis
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Exclusive match reports, grassroots tournament bulletins, and expert tactical breakdowns.
          </p>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: filterCat === c ? '1px solid #10b981' : '1px solid #e2e8f0',
                backgroundColor: filterCat === c ? '#10b981' : '#ffffff',
                color: filterCat === c ? '#ffffff' : '#475569',
                cursor: 'pointer'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Headline Hero */}
      {filteredNews[0] && (
        <div
          onClick={() => setSelectedArticle(filteredNews[0])}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '1.5rem',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
          }}
        >
          <div style={{ maxHeight: '340px', overflow: 'hidden' }}>
            <img
              src={filteredNews[0].image}
              alt={filteredNews[0].title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                  {filteredNews[0].category}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>•</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>{filteredNews[0].date}</span>
              </div>

              <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.3, marginBottom: '12px' }}>
                {filteredNews[0].title}
              </h2>

              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                {filteredNews[0].excerpt}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>By {filteredNews[0].author} • {filteredNews[0].readTime}</span>
              <span style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Read Full Story →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Articles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredNews.slice(1).map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid #f1f5f9',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <img
                src={art.image}
                alt={art.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#10b981', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                    {art.category}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{art.date}</span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, margin: '4px 0 8px 0' }}>
                  {art.title}
                </h3>

                <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div style={{ padding: '12px 1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
              <span>{art.author}</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>{art.readTime}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Read Modal */}
      {selectedArticle && (
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
            padding: '2rem',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '3px 10px', borderRadius: '6px' }}>
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.3, marginBottom: '12px' }}>
              {selectedArticle.title}
            </h2>

            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
              By <strong>{selectedArticle.author}</strong> • Published {selectedArticle.date} • {selectedArticle.readTime}
            </div>

            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.25rem' }}
            />

            <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {selectedArticle.excerpt}
            </p>

            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              The intensity of this tournament continues to draw record-setting numbers across both international stadiums and village grass roots leagues. Coaches and analysts emphasize that maintaining strike rate under pressure and executing yorkers at death remain the key determining factors for victory.
            </p>

            <button
              onClick={() => setSelectedArticle(null)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Close Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
