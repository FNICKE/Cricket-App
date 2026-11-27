import React, { useState } from 'react';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Shirt,
  Scissors,
  Award,
  CreditCard,
  Clock,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  ExternalLink,
  Zap,
  ArrowRight,
  Eye,
  Copy,
  Check,
  QrCode,
  Sparkles,
  Download
} from 'lucide-react';

export interface PlayerRegistration {
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
  createdAt?: string;
}

interface PlayerProfilePageProps {
  player: PlayerRegistration;
  sessionToken: string;
  onLogout: () => void;
  onNavigateToMatchCentre: () => void;
  onPlayerUpdated: (updated: PlayerRegistration) => void;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function PlayerProfilePage({
  player,
  sessionToken,
  onLogout,
  onNavigateToMatchCentre,
  onPlayerUpdated
}: PlayerProfilePageProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [renewSuccessMsg, setRenewSuccessMsg] = useState('');

  // Copy Membership ID to clipboard
  const handleCopyId = () => {
    navigator.clipboard?.writeText(player.membershipId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Renew Subscription for 1 Year (+365 days)
  const handleRenewSubscription = async () => {
    try {
      setRenewing(true);
      const res = await fetch(`${API_BASE}/players/renew/${player.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      const data = await res.json();
      if (res.ok && data.success && data.player) {
        onPlayerUpdated(data.player);
        setRenewSuccessMsg('Membership renewed successfully! Valid for next 365 days.');
        setTimeout(() => setRenewSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error renewing membership:', err);
    } finally {
      setRenewing(false);
    }
  };

  // Subscription calculation
  const totalDaysInYear = 365;
  const daysUsed = Math.min(365, Math.max(0, totalDaysInYear - player.daysRemaining));
  const progressPercent = Math.min(100, Math.round((daysUsed / totalDaysInYear) * 100));

  const startDateFormatted = new Date(player.subscriptionStart).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const endDateFormatted = new Date(player.subscriptionEnd).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: 'clamp(1rem, 3.5vw, 2.5rem)',
      minHeight: 'calc(100vh - 3.75rem)'
    }}>
      {/* ══════════════════════════════════════════════════════
          TOP NOTIFICATION BAR IF RENEWED
      ══════════════════════════════════════════════════════ */}
      {renewSuccessMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          color: '#047857',
          fontWeight: 700,
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{renewSuccessMsg}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          HERO PROFILE HEADER (TaskVerse Card Style)
      ══════════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '1.5rem',
        border: '1px solid #f1f5f9',
        padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        {/* Subtle Top Gradient Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: player.isExpired
            ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
            : 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
        }} />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          {/* Left: Avatar & Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={player.photoUrl}
                alt={player.fullName}
                style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '1.25rem',
                  objectFit: 'cover',
                  border: `3px solid ${player.isExpired ? '#fca5a5' : '#a7f3d0'}`,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                backgroundColor: player.isExpired ? '#ef4444' : '#10b981',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.85rem)', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  {player.fullName}
                </h1>
                
                {/* Role Tag */}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Award size={13} color="#10b981" />
                  {player.role}
                </span>

                {/* Status Badge */}
                {player.isExpired ? (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <AlertTriangle size={13} />
                    EXPIRED (Year Ended)
                  </span>
                ) : (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    border: '1px solid #a7f3d0',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShieldCheck size={13} />
                    PAID & ACTIVE ({player.daysRemaining} days left)
                  </span>
                )}
              </div>

              {/* ID and Copy Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b' }}>MEMBERSHIP ID:</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>
                    {player.membershipId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    title="Copy ID"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: copiedId ? '#10b981' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {copiedId ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>

                <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Member since {startDateFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={onNavigateToMatchCentre}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <span>Watch Live Matches</span>
              <ExternalLink size={14} />
            </button>

            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#dc2626',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          EXPIRED ALERT BANNER (IF EXPIRED)
      ══════════════════════════════════════════════════════ */}
      {player.isExpired && (
        <div style={{
          backgroundColor: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '1.25rem',
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 2px 4px rgba(225, 29, 72, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#ffe4e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e11d48'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#9f1239' }}>
                Your 1-Year Player Subscription Has Expired!
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#be123c', marginTop: '2px' }}>
                Subscription ended on {endDateFormatted}. Tournament participation and team kit allocation are currently paused.
              </div>
            </div>
          </div>

          <button
            onClick={handleRenewSubscription}
            disabled={renewing}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e11d48',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 800,
              cursor: renewing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px rgba(225, 29, 72, 0.25)'
            }}
          >
            <RefreshCw size={15} className={renewing ? 'animate-spin' : ''} />
            <span>{renewing ? 'Renewing...' : 'Renew for 1 Year (+365 Days)'}</span>
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MAIN DETAILS GRID (TaskVerse Layout)
      ══════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* ====================================================
            CARD 1: YEARLY SUBSCRIPTION PROGRESS & EXPIRY
        ==================================================== */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          border: '1px solid #f1f5f9',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#10b981" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                1-Year Subscription Validity
              </h3>
            </div>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              backgroundColor: player.isExpired ? '#fef2f2' : '#ecfdf5',
              color: player.isExpired ? '#dc2626' : '#059669',
              padding: '2px 8px',
              borderRadius: '9999px',
              textTransform: 'uppercase'
            }}>
              {player.isExpired ? 'Expired' : 'Active'}
            </span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                Days Remaining
              </span>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: player.isExpired ? '#dc2626' : '#10b981'
              }}>
                {player.daysRemaining} <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>/ 365 Days</span>
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f1f5f9',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${100 - progressPercent}%`,
                height: '100%',
                backgroundColor: player.isExpired ? '#ef4444' : '#10b981',
                borderRadius: '9999px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Date Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Subscription Start
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                {startDateFormatted}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Valid Until (Expiry)
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: player.isExpired ? '#dc2626' : '#0f172a',
                marginTop: '2px'
              }}>
                {endDateFormatted}
              </div>
            </div>
          </div>

          {!player.isExpired && (
            <div style={{ marginTop: '1rem', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
              <button
                onClick={handleRenewSubscription}
                disabled={renewing}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={13} className={renewing ? 'animate-spin' : ''} />
                <span>Extend Early for Next Year (+365 Days)</span>
              </button>
            </div>
          )}
        </div>

        {/* ====================================================
            CARD 2: UNIFORM KIT & SIZING
        ==================================================== */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          border: '1px solid #f1f5f9',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Shirt size={18} color="#10b981" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Official Uniform & Kit Sizing
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
            {/* T-Shirt Size */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                T-Shirt Size
              </div>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#10b981',
                margin: '4px 0'
              }}>
                {player.tshirtSize}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                Athletic Dry-Fit
              </div>
            </div>

            {/* Pant Size */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Track Pant Size
              </div>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#0f172a',
                margin: '4px 0'
              }}>
                {player.pantSize}″
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                Waist Elastic Cut
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '8px 12px',
            borderRadius: '8px'
          }}>
            <CheckCircle2 size={15} color="#10b981" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857' }}>
              Kit Allocated for 2026 Club Tournament Season
            </span>
          </div>
        </div>

        {/* ====================================================
            CARD 3: PAYMENT & RECEIPT DETAILS
        ==================================================== */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          border: '1px solid #f1f5f9',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <CreditCard size={18} color="#10b981" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Payment & Receipt Verification
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Amount Paid</span>
              <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a' }}>
                ₹{player.amountPaid?.toLocaleString('en-IN') || '2,500'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Payment Mode</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                {player.paymentMethod}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Verification Status</span>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                backgroundColor: player.paymentStatus === 'paid' ? '#ecfdf5' : '#fef2f2',
                color: player.paymentStatus === 'paid' ? '#047857' : '#dc2626',
                border: `1px solid ${player.paymentStatus === 'paid' ? '#a7f3d0' : '#fecaca'}`,
                padding: '2px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                {player.paymentStatus}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowReceiptModal(true)}
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#1e293b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
          >
            <Eye size={15} color="#64748b" />
            <span>View Payment Receipt Screenshot</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CONTACT & RESIDENTIAL INFORMATION
      ══════════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '1.25rem',
        border: '1px solid #f1f5f9',
        padding: '1.75rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <User size={18} color="#10b981" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Player Contact & Residential Information
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Mobile Number */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              flexShrink: 0
            }}>
              <Phone size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Mobile / WhatsApp
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {player.mobileNumber}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                Verified via OTP
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              flexShrink: 0
            }}>
              <Mail size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Email Address
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {player.email}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '2px' }}>
                Match notification recipient
              </div>
            </div>
          </div>

          {/* Address */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              flexShrink: 0
            }}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Residential & Kit Delivery Address
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                {player.address}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DIGITAL PLAYER MEMBERSHIP CARD (PRINTABLE / SHAREABLE)
      ══════════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '1.5rem',
        padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.3)'
      }}>
        {/* Glow Accents */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.025em' }}>
                CRIC<span style={{ color: '#10b981' }}>VERSE</span> DIGITAL PLAYER PASS
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600 }}>
                Official BCCI-Affiliated Club Season Membership
              </div>
            </div>
          </div>

          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            backgroundColor: player.isExpired ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: player.isExpired ? '#fca5a5' : '#6ee7b7',
            border: `1px solid ${player.isExpired ? '#ef4444' : '#10b981'}`,
            padding: '3px 10px',
            borderRadius: '9999px',
            textTransform: 'uppercase'
          }}>
            {player.isExpired ? 'Expired Pass' : 'Verified Pass'}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          {/* Left: Player ID Card details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={player.photoUrl}
              alt={player.fullName}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                {player.fullName}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginTop: '2px' }}>
                {player.role.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '4px' }}>
                {player.membershipId}
              </div>
            </div>
          </div>

          {/* Middle: Kit specs */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            <div>
              <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>T-Shirt</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981' }}>{player.tshirtSize}</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <div>
              <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Pant Waist</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>{player.pantSize}″</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <div>
              <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Valid Until</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 900, color: player.isExpired ? '#f87171' : '#ffffff' }}>
                {endDateFormatted}
              </div>
            </div>
          </div>

          {/* Right: Barcode simulation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '6px 12px',
              borderRadius: '6px',
              display: 'flex',
              gap: '3px',
              height: '36px',
              alignItems: 'flex-end'
            }}>
              {[4, 2, 5, 1, 3, 6, 2, 4, 3, 5, 2, 6, 3, 2, 5, 4, 2].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: `${(i % 3) + 2}px`,
                    height: `${h * 5}px`,
                    backgroundColor: '#0f172a'
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '4px' }}>
              SECURE-BARCODE-PASS
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          RECEIPT SCREENSHOT MODAL
      ══════════════════════════════════════════════════════ */}
      {showReceiptModal && (
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
            padding: '1.5rem',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Payment Screenshot Proof
                </h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <img
                src={player.paymentScreenshotUrl}
                alt="Payment Receipt Screenshot"
                style={{
                  width: '100%',
                  maxHeight: '380px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop';
                }}
              />
            </div>

            <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Submitted transaction verification for <strong>₹{player.amountPaid?.toLocaleString('en-IN') || '2,500'}</strong> via <strong>{player.paymentMethod}</strong>.
            </div>

            <button
              onClick={() => setShowReceiptModal(false)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
