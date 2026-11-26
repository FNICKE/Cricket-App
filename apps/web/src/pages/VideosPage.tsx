import React, { useState, useEffect } from 'react';
import { Play, Clock, Eye, Film, Sparkles } from 'lucide-react';

interface VideoItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  views: string;
  date: string;
  videoUrl: string;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [filterCat, setFilterCat] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/videos`)
      .then((r) => r.json())
      .then((d) => setVideos(d.videos || []))
      .catch((err) => console.warn('Error fetching videos:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Match Highlights', 'Wickets Reel', 'Village Highlights', 'Press Meets'];

  const filteredVideos = videos.filter((v) => filterCat === 'All' || v.category === filterCat);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
              Video Arena
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>HD Match Highlights & Reels</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '-0.025em' }}>
            Match Highlights & Video Clips
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Watch monster sixes, unplayable deliveries, press conferences, and Village League fireworks.
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

      {/* Videos Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredVideos.map((v) => (
          <div
            key={v.id}
            onClick={() => setActiveVideo(v)}
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
              {/* Thumbnail Container */}
              <div style={{ position: 'relative', height: '190px' }}>
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Play Button Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  <Play size={20} fill="#ffffff" style={{ marginLeft: '2px' }} />
                </div>
                {/* Duration Tag */}
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.6875rem',
                  fontWeight: 700
                }}>
                  {v.duration}
                </span>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#10b981', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                    {v.category}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{v.date}</span>
                </div>

                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, margin: '4px 0 8px 0' }}>
                  {v.title}
                </h3>
              </div>
            </div>

            <div style={{ padding: '10px 1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
              <span>{v.views}</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>Watch Now →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            maxWidth: '780px',
            width: '100%',
            color: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
                  {activeVideo.category}
                </span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 900, margin: '2px 0 0 0' }}>
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            {/* Video Player Mockup / Stream */}
            <div style={{
              width: '100%',
              height: '380px',
              backgroundColor: '#000000',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <img
                src={activeVideo.thumbnail}
                alt={activeVideo.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
              />
              <div style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.4)'
                }}>
                  <Play size={28} fill="#ffffff" style={{ marginLeft: '4px' }} />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  Playing HD Match Stream ({activeVideo.duration})
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {activeVideo.views} • Uploaded {activeVideo.date}
              </span>
              <button
                onClick={() => setActiveVideo(null)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
