import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Shirt,
  Scissors,
  Award,
  CreditCard,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Calendar,
  Search,
  Upload,
  RefreshCw,
  ExternalLink,
  Zap,
  Check,
  ChevronRight,
  Eye
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

interface PlayerRegistrationPageProps {
  onRegisteredLogin?: (player: PlayerRegistration, token: string) => void;
}

const API_BASE = 'http://localhost:4000/api/v1';

export default function PlayerRegistrationPage({ onRegisteredLogin }: PlayerRegistrationPageProps = {}) {
  const [registrations, setRegistrations] = useState<PlayerRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'register' | 'directory'>('register');
  const [receiptModalUrl, setReceiptModalUrl] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop');
  const [tshirtSize, setTshirtSize] = useState('L');
  const [pantSize, setPantSize] = useState('32');
  const [role, setRole] = useState<'Batsman' | 'Bowler' | 'Allrounder' | 'Wicket-Keeper'>('Batsman');
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe / Paytm)');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [submitSuccess, setSubmitSuccess] = useState<PlayerRegistration | null>(null);
  const [registrationToken, setRegistrationToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch registrations from API
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/players/registrations`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.warn('API error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Screenshot File Upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit registration form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !mobileNumber.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }
    if (password.length < 12 || new TextEncoder().encode(password).length > 72) {
      setErrorMessage('Choose a password between 12 and 72 bytes.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/players/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          address: address || 'Mumbai, Maharashtra',
          email,
          mobileNumber,
          photoUrl,
          tshirtSize,
          pantSize,
          role,
          paymentMethod,
          paymentScreenshotUrl,
          amountPaid: 2500,
          password
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(data.registration);
        setRegistrationToken(data.token);
        fetchRegistrations();
        // Reset form
        setFullName('');
        setAddress('');
        setEmail('');
        setMobileNumber('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // Filter registrations by search
  const filteredRegistrations = registrations.filter((r) =>
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.membershipId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 2.5vw, 1.75rem) clamp(0.75rem, 3.5vw, 2rem)' }}>
      {/* ══════════════════════════════════════════════════
          1. TASKVERSE HEADER & METRIC STAT CARDS
      ══════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Cricket League Membership
              </span>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '9999px' }}>
                Season 2026-27
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0', letterSpacing: '-0.025em' }}>
              Player Registration & Kit Pass
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Join the league with an annual 1-year player subscription, customized uniform kit, and official membership ID.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setActiveTab('register'); setSubmitSuccess(null); }}
              style={{
                backgroundColor: activeTab === 'register' ? '#10b981' : '#ffffff',
                color: activeTab === 'register' ? '#ffffff' : '#64748b',
                border: activeTab === 'register' ? '1px solid #10b981' : '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: activeTab === 'register' ? '0 4px 10px rgba(16, 185, 129, 0.25)' : 'none'
              }}
            >
              + New Registration
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              style={{
                backgroundColor: activeTab === 'directory' ? '#0f172a' : '#ffffff',
                color: activeTab === 'directory' ? '#ffffff' : '#64748b',
                border: activeTab === 'directory' ? '1px solid #0f172a' : '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: activeTab === 'directory' ? '0 4px 10px rgba(15, 23, 42, 0.15)' : 'none'
              }}
            >
              Member Directory ({registrations.length})
            </button>
          </div>
        </div>

        {/* 4 TaskVerse StatCards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {/* Annual Fee */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Annual Fee</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1 }}>₹2,500</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', marginTop: '6px' }}>Yearly Membership</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <CreditCard size={20} />
            </div>
          </div>

          {/* Validity */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Subscription Period</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1 }}>365 Days</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>Expires automatically after 1 year</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6' }}>
              <Calendar size={20} />
            </div>
          </div>

          {/* Kit Uniform */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Custom Uniform</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1 }}>T-Shirt + Pant</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8b5cf6', marginTop: '6px' }}>Included with registration</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
              <Shirt size={20} />
            </div>
          </div>

          {/* Verification Status */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Payment Proof</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1 }}>Receipt</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b', marginTop: '6px' }}>Screenshot verification</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#f59e0b' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          2. REGISTRATION FORM OR SUCCESS CARD
      ══════════════════════════════════════════════════ */}
      {activeTab === 'register' && !submitSuccess && (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
            
            {/* Left: Player & Kit Details */}
            <div className="tv-card" style={{ padding: '28px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} className="text-emerald-500" />
                Player Personal & Kit Information
              </h2>

              {errorMessage && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8125rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Player Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Virat Kohli / Rahul Dravid"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Email & Mobile */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Create Password (12+ characters) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={12}
                    maxLength={72}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={12}
                    maxLength={72}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Full Residential Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat number, Street, Area, City, Pincode"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Playing Role */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Playing Role *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'Batsman', label: '🏏 Batsman' },
                    { id: 'Bowler', label: '⚡ Bowler' },
                    { id: 'Allrounder', label: '🔥 Allrounder' },
                    { id: 'Wicket-Keeper', label: '🧤 Keeper' }
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id as any)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '10px',
                        border: role === r.id ? '2px solid #10b981' : '1px solid #e2e8f0',
                        backgroundColor: role === r.id ? '#ecfdf5' : '#ffffff',
                        color: role === r.id ? '#065f46' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Uniform Kit Sizes (T-Shirt & Pant) */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Shirt size={16} className="text-emerald-500" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>Uniform Kit Sizing</span>
                  <span style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 700, backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '9999px' }}>Included</span>
                </div>

                {/* T-Shirt Size */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Jersey / T-Shirt Size (Chest)
                  </label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setTshirtSize(size)}
                        style={{
                          width: '42px',
                          height: '36px',
                          borderRadius: '8px',
                          border: tshirtSize === size ? '2px solid #10b981' : '1px solid #cbd5e1',
                          backgroundColor: tshirtSize === size ? '#10b981' : '#ffffff',
                          color: tshirtSize === size ? '#ffffff' : '#0f172a',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pant Size */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Track Pant / Lower Size (Waist in Inches)
                  </label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['28', '30', '32', '34', '36', '38', '40'].map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setPantSize(size)}
                        style={{
                          width: '42px',
                          height: '36px',
                          borderRadius: '8px',
                          border: pantSize === size ? '2px solid #10b981' : '1px solid #cbd5e1',
                          backgroundColor: pantSize === size ? '#10b981' : '#ffffff',
                          color: pantSize === size ? '#ffffff' : '#0f172a',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Photo, Payment & Screenshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Photo Upload Card */}
              <div className="tv-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={18} className="text-blue-500" />
                  Player Profile Photo
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <img
                    src={photoUrl}
                    alt="Player preview"
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #10b981',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <div>
                    <label
                      htmlFor="photo-upload"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#f1f5f9',
                        color: '#0f172a',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Upload size={14} />
                      <span>Upload Profile Photo</span>
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                    <p style={{ fontSize: '0.6875rem', color: '#94a3b8', margin: '4px 0 0 0' }}>PNG or JPG (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Payment Method & Screenshot Card */}
              <div className="tv-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} className="text-amber-500" />
                  Yearly Subscription & Payment
                </h3>

                {/* Amount Notice */}
                <div style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>1-Year League Pass</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#065f46' }}>₹2,500.00</div>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, backgroundColor: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '6px' }}>
                    365 DAYS
                  </span>
                </div>

                {/* Payment Method */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Payment Method *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  >
                    <option value="UPI (GPay / PhonePe / Paytm)">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Bank Transfer (NEFT / IMPS)">Bank Transfer (NEFT / IMPS)</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cash to Official">Cash to Official Organizer</option>
                  </select>
                </div>

                {/* Screenshot Upload Dropzone */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Payment Screenshot / Receipt *
                  </label>
                  <div style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    position: 'relative'
                  }}>
                    {paymentScreenshotUrl ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={paymentScreenshotUrl}
                          alt="Payment Receipt"
                          style={{ maxHeight: '110px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #e2e8f0' }}
                        />
                        <label
                          htmlFor="screenshot-upload"
                          style={{
                            fontSize: '0.6875rem',
                            color: '#10b981',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Change Screenshot
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="screenshot-upload" style={{ cursor: 'pointer', display: 'block' }}>
                        <Upload size={24} style={{ margin: '0 auto 6px auto', color: '#94a3b8' }} />
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Click to upload payment receipt</div>
                        <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Supports screenshot of UPI / Bank confirmation</div>
                      </label>
                    )}
                    <input
                      id="screenshot-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '14px',
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{loading ? 'Processing Registration...' : 'Complete Registration & Join'}</span>
                </button>
              </div>

            </div>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════
          3. REGISTRATION SUCCESS PLAYER CARD
      ══════════════════════════════════════════════════ */}
      {submitSuccess && (
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div className="tv-card" style={{ padding: '32px', border: '2px solid #a7f3d0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Registration Confirmed!
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 24px 0' }}>
              Your 1-year player subscription is active. Here is your official Player Pass:
            </p>

            {/* Official Digital Player Pass Card */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: '18px',
              padding: '24px',
              textAlign: 'left',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid #334155',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.1em' }}>CRICVERSE OFFICIAL PASS</span>
                <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontSize: '0.625rem', fontWeight: 900, padding: '3px 8px', borderRadius: '9999px' }}>
                  ACTIVE (365 DAYS)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '20px' }}>
                <img
                  src={submitSuccess.photoUrl}
                  alt={submitSuccess.fullName}
                  style={{ width: '74px', height: '74px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #10b981' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 4px 0', color: '#ffffff' }}>
                    {submitSuccess.fullName}
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: '#38bdf8', fontWeight: 700 }}>{submitSuccess.role}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>ID: {submitSuccess.membershipId}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase' }}>T-Shirt</span>
                  <strong style={{ fontSize: '0.875rem', color: '#f1f5f9' }}>Size {submitSuccess.tshirtSize}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase' }}>Pant</span>
                  <strong style={{ fontSize: '0.875rem', color: '#f1f5f9' }}>Waist {submitSuccess.pantSize}"</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase' }}>Validity</span>
                  <strong style={{ fontSize: '0.875rem', color: '#10b981' }}>1 Year</strong>
                </div>
              </div>

              <div style={{ marginTop: '14px', fontSize: '0.6875rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                <span>Paid via {submitSuccess.paymentMethod}</span>
                <span>Valid until: {new Date(submitSuccess.subscriptionEnd).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
              <button
                onClick={() => setSubmitSuccess(null)}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
              >
                + Register Another Player
              </button>
              {onRegisteredLogin && registrationToken && (
                <button
                  onClick={() => onRegisteredLogin(submitSuccess, registrationToken)}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    fontWeight: 800,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  Open My Player Profile &rarr;
                </button>
              )}
              <button
                onClick={() => setActiveTab('directory')}
                style={{
                  backgroundColor: onRegisteredLogin ? '#ffffff' : '#10b981',
                  color: onRegisteredLogin ? '#475569' : '#ffffff',
                  border: onRegisteredLogin ? '1px solid #cbd5e1' : 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
              >
                View Member Directory &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          4. MEMBER DIRECTORY & SUBSCRIPTION EXPIRY STATUS
      ══════════════════════════════════════════════════ */}
      {activeTab === 'directory' && (
        <div className="tv-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                Registered Players Directory & Yearly Validity
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Subscriptions are valid for 1 year from payment date. Expired players can renew their pass.
              </p>
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '6px 12px', width: '280px' }}>
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, ID or role..."
                style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '0.8125rem', width: '100%' }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 14px' }}>Player</th>
                  <th style={{ padding: '10px 14px' }}>Role</th>
                  <th style={{ padding: '10px 14px' }}>Kit Sizes</th>
                  <th style={{ padding: '10px 14px' }}>Membership ID</th>
                  <th style={{ padding: '10px 14px' }}>Status & Expiry</th>
                  <th style={{ padding: '10px 14px' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: reg.isExpired ? '#fef2f2' : 'transparent' }}>
                    {/* Player Info */}
                    <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={reg.photoUrl}
                        alt={reg.fullName}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${reg.isExpired ? '#ef4444' : '#10b981'}` }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{reg.fullName}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{reg.mobileNumber}</div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: reg.role === 'Batsman' ? '#eff6ff' : reg.role === 'Bowler' ? '#ecfdf5' : '#f5f3ff',
                        color: reg.role === 'Batsman' ? '#1d4ed8' : reg.role === 'Bowler' ? '#047857' : '#6d28d9'
                      }}>
                        {reg.role}
                      </span>
                    </td>

                    {/* Sizes */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                        T-Shirt: <strong>{reg.tshirtSize}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Pant: <strong>{reg.pantSize}"</strong>
                      </div>
                    </td>

                    {/* Membership ID */}
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#475569' }}>
                      {reg.membershipId}
                    </td>

                    {/* Status & Expiry Logic */}
                    <td style={{ padding: '12px 14px' }}>
                      {reg.isExpired ? (
                        <div>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fca5a5',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.6875rem',
                            fontWeight: 800
                          }}>
                            <AlertTriangle size={12} />
                            EXPIRED (Year Ended)
                          </span>
                          <div style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '2px', fontWeight: 600 }}>
                            Expired on {new Date(reg.subscriptionEnd).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#dcfce7',
                            color: '#15803d',
                            border: '1px solid #86efac',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.6875rem',
                            fontWeight: 800
                          }}>
                            <CheckCircle2 size={12} />
                            PAID & ACTIVE
                          </span>
                          <div style={{ fontSize: '0.6875rem', color: '#16a34a', marginTop: '2px', fontWeight: 700 }}>
                            {reg.daysRemaining} days left (Expires {new Date(reg.subscriptionEnd).toLocaleDateString()})
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Receipt Screenshot Modal Preview */}
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => setReceiptModalUrl(reg.paymentScreenshotUrl)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: '#0f172a'
                        }}
                      >
                        <Eye size={12} />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {receiptModalUrl && (
        <div
          onClick={() => setReceiptModalUrl(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Payment Proof Receipt</h3>
              <button onClick={() => setReceiptModalUrl(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <img
              src={receiptModalUrl}
              alt="Payment Screenshot"
              style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
            <button
              onClick={() => setReceiptModalUrl(null)}
              style={{ marginTop: '16px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
