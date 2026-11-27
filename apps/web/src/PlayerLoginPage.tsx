import React, { useState } from 'react';
import {
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Globe,
  Award,
  Clock,
  Shirt,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface PlayerRegistration {
  id: number;
  membershipId: string;
  fullName: string;
  address: string;
  email: string;
  mobileNumber: string;
  photoUrl: string;
  tshirtSize: string;
  pantSize: string;
  role: string;
  paymentMethod: string;
  paymentScreenshotUrl: string;
  amountPaid: number;
  paymentStatus: 'paid' | 'pending' | 'expired';
  subscriptionStart: string;
  subscriptionEnd: string;
  daysRemaining: number;
  isExpired: boolean;
}

interface PlayerLoginPageProps {
  onLoginSuccess: (player: PlayerRegistration, token: string) => void;
  onContinueAsViewer: () => void;
  onNavigateToRegister: () => void;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function PlayerLoginPage({
  onLoginSuccess,
  onContinueAsViewer,
  onNavigateToRegister
}: PlayerLoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Membership ID, Registered Email, or Mobile Number.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/players/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Login failed. Please verify your details.');
        return;
      }

      onLoginSuccess(data.player, data.token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to server. Ensure API is running on :4000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'clamp(1rem, 3.5vw, 2.5rem)',
      minHeight: 'calc(100vh - 3.75rem)'
    }}>
      {/* ══════════════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════════════ */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          padding: '6px 14px',
          borderRadius: '9999px',
          color: '#047857',
          fontSize: '0.8125rem',
          fontWeight: 800,
          marginBottom: '1rem'
        }}>
          <Sparkles size={14} color="#10b981" />
          <span>CRICVERSE MEMBERSHIP & ACCESS GATEWAY</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 900,
          color: '#0f172a',
          letterSpacing: '-0.03em',
          marginBottom: '0.75rem'
        }}>
          Choose Your <span style={{ color: '#10b981' }}>Experience</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          Watch live cricket matches effortlessly as a guest viewer with zero login needed, or sign in to your official player account to view your 1-year kit membership pass and profile details.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════
          TWO-COLUMN GATEWAY: VIEWER ACCESS vs PLAYER LOGIN
      ══════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'stretch'
      }}>
        {/* ====================================================
            CARD 1: CONTINUE AS VIEWER (NO LOGIN REQUIRED)
        ==================================================== */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          border: '1px solid #e2e8f0',
          padding: 'clamp(1.5rem, 3vw, 2.25rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Top Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: '#3b82f6'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}>
                <Globe size={24} />
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                padding: '4px 10px',
                borderRadius: '9999px',
                textTransform: 'uppercase'
              }}>
                Instant Access
              </span>
            </div>

            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Continue as Viewer
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Enjoy live cricket with zero registration or credentials required. Instant access for fans and match enthusiasts.
            </p>

            {/* Feature Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
              {[
                'Real-Time Ball-by-Ball Live Commentary & Wickets',
                'Comprehensive Innings Scorecards, CRR & RRR formulas',
                'Live Strike Rotation & Partnership Wagon Visuals',
                'Public Player Directory & Tournament Standings',
                'No password, login, or personal info required'
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={onContinueAsViewer}
              style={{
                width: '100%',
                padding: '0.875rem 1.25rem',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.15)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0f172a')}
            >
              <span>Enter Match Centre as Viewer</span>
              <ArrowRight size={18} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.75rem' }}>
              Open directly • No session timeout
            </p>
          </div>
        </div>

        {/* ====================================================
            CARD 2: PLAYER LOGIN (REGISTERED MEMBERS)
        ==================================================== */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          border: '1px solid #a7f3d0',
          padding: 'clamp(1.5rem, 3vw, 2.25rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.08), 0 4px 6px -2px rgba(16, 185, 129, 0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Top Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669'
              }}>
                <User size={24} />
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#047857',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '4px 10px',
                borderRadius: '9999px',
                textTransform: 'uppercase'
              }}>
                Official Player Portal
              </span>
            </div>

            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Registered Player Login
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Sign in with your Membership ID, Email, or Mobile and the password you set during registration.
            </p>

            {/* Error Banner */}
            {errorMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#b91c1c',
                fontSize: '0.8125rem',
                fontWeight: 600,
                marginBottom: '1.25rem'
              }}>
                <AlertCircle size={16} flexShrink={0} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Membership ID / Email / Mobile
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. CRIC-2026-0101 or rohit.verma@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.875rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password set during registration"
                    minLength={12}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.25rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '0.5rem',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#059669')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#10b981')}
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Player Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Not registered yet?{' '}
            </span>
            <button
              onClick={onNavigateToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: '#10b981',
                fontWeight: 800,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Register as New Player →
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BOTTOM MEMBERSHIP HIGHLIGHTS BANNER
      ══════════════════════════════════════════════════════ */}
      <div style={{
        marginTop: '3rem',
        backgroundColor: '#ffffff',
        borderRadius: '1.25rem',
        border: '1px solid #f1f5f9',
        padding: '1.5rem clamp(1rem, 3.5vw, 2rem)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
              Official Cricket Club Annual Membership
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              All registered players receive full customized match kit (T-shirt & track pant) + 365 days season tournament eligibility.
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateToRegister}
          style={{
            padding: '8px 18px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#047857',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Register for 2026 Season</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
