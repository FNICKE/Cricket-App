import React, { useState, useEffect } from 'react';
import {
  Trophy,
  MapPin,
  Users,
  Shield,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Upload,
  Search,
  Eye,
  Award,
  Shirt,
  Scissors,
  Zap,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';

interface VillagePlayer {
  id: number;
  name: string;
  role: 'Batsman' | 'Bowler' | 'Allrounder' | 'Wicket-Keeper';
  tshirtSize: string;
  pantSize: string;
  mobile: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isReserve?: boolean;
}

interface VillageTeam {
  id: number;
  registrationId: string;
  taluka: string;
  association: string;
  villageName: string;
  teamName: string;
  captainName: string;
  captainMobile: string;
  captainEmail: string;
  amount: number;
  paymentMethod: string;
  paymentScreenshotUrl: string;
  paymentStatus: 'paid' | 'pending' | 'verified';
  players: VillagePlayer[];
  createdAt: string;
}

const TALUKAS = ['Panvel', 'Uran', 'Karjat', 'Pen', 'Alibaug', 'Khalapur', 'Roha'];

const API_BASE = 'http://localhost:4000/api/v1';

export default function VillageLeaguePage() {
  const [activeTab, setActiveTab] = useState<'register' | 'teams'>('register');
  const [teams, setTeams] = useState<VillageTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<VillageTeam | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Registration Form State
  const [taluka, setTaluka] = useState('Panvel');
  const [association, setAssociation] = useState('Panvel Taluka Cricket Association');
  const [villageName, setVillageName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainMobile, setCaptainMobile] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI (PhonePe / GPay / Paytm)');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState(
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop'
  );

  // 15 Players Roster (11 A-Players + 4 B-Reserves)
  const defaultPlayers: VillagePlayer[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? 'Captain Player' : i === 1 ? 'Vice-Captain Player' : `Player ${i + 1}`,
    role: i < 5 ? 'Batsman' : i < 8 ? 'Allrounder' : i < 10 ? 'Wicket-Keeper' : 'Bowler',
    tshirtSize: 'L',
    pantSize: '32',
    mobile: '+91 98200 000' + String(i + 10),
    isCaptain: i === 0,
    isViceCaptain: i === 1,
    isReserve: i >= 11
  }));

  const [players, setPlayers] = useState<VillagePlayer[]>(defaultPlayers);
  const [successTeam, setSuccessTeam] = useState<VillageTeam | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch registered teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/village-league/teams`);
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams || []);
      }
    } catch (err) {
      console.warn('Error fetching village teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Update Taluka and default association
  const handleTalukaChange = (newTaluka: string) => {
    setTaluka(newTaluka);
    setAssociation(`${newTaluka} Taluka Cricket Association`);
  };

  // Update individual player in the 15-player list
  const updatePlayerField = (index: number, field: keyof VillagePlayer, val: any) => {
    const updated = [...players];
    updated[index] = { ...updated[index], [field]: val };
    setPlayers(updated);
  };

  // Handle Payment Screenshot Upload
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

  // Submit registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!villageName.trim() || !teamName.trim() || !captainName.trim() || !captainMobile.trim()) {
      setErrorMsg('Please fill in Village Name, Team Name, Captain Name and Mobile Number.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/village-league/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taluka,
          association,
          villageName,
          teamName,
          captainName,
          captainMobile,
          captainEmail: captainEmail || `${teamName.toLowerCase().replace(/\s+/g, '')}@villageleague.in`,
          paymentMethod,
          paymentScreenshotUrl,
          players
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessTeam(data.team);
        fetchTeams();
      } else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(
    (t) =>
      t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.villageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.taluka.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 3.5vw, 2.5rem)', minHeight: 'calc(100vh - 3.75rem)' }}>
      {/* ══════════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '1.5rem',
        border: '1px solid #f1f5f9',
        padding: 'clamp(1.5rem, 3vw, 2.25rem)',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '9999px', textTransform: 'uppercase' }}>
                Grassroots League Tournament 2026
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: '9999px' }}>
                Fixed Fee: ₹500 Compulsory
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '4px 0 8px 0', letterSpacing: '-0.03em' }}>
              Village Premium League <span style={{ color: '#10b981' }}>(VPL 2026)</span>
            </h1>

            <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
              Official tournament registration for Village Teams across Talukas (Panvel, Uran, Karjat, Pen, Alibaug). Complete team registration requires Taluka Association selection, compulsory ₹500 fee, and a verified 15-player squad (11 A-Players + 4 B-Reserves).
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setActiveTab('register'); setSuccessTeam(null); }}
              style={{
                backgroundColor: activeTab === 'register' ? '#10b981' : '#ffffff',
                color: activeTab === 'register' ? '#ffffff' : '#64748b',
                border: activeTab === 'register' ? '1px solid #10b981' : '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '0.8125rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Trophy size={15} />
              <span>Register Village Team (₹500)</span>
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              style={{
                backgroundColor: activeTab === 'teams' ? '#0f172a' : '#ffffff',
                color: activeTab === 'teams' ? '#ffffff' : '#64748b',
                border: activeTab === 'teams' ? '1px solid #0f172a' : '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '0.8125rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={15} />
              <span>Registered Teams Directory ({teams.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SUCCESS CERTIFICATE MODAL / VIEW
      ══════════════════════════════════════════════════ */}
      {successTeam && (
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.4)',
          border: '1px solid #334155',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#ffffff'
          }}>
            <Trophy size={32} />
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Official Tournament Entry Pass
          </span>

          <h2 style={{ fontSize: '1.875rem', fontWeight: 900, margin: '6px 0 12px 0' }}>
            {successTeam.teamName} Registered!
          </h2>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '6px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
            <span style={{ color: '#94a3b8' }}>REGISTRATION ID:</span>
            <span style={{ color: '#34d399', fontWeight: 900 }}>{successTeam.registrationId}</span>
          </div>

          <div style={{
            maxWidth: '680px',
            margin: '0 auto 2rem auto',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase' }}>Taluka</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff' }}>{successTeam.taluka}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase' }}>Association</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>{successTeam.association}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase' }}>Village (Team)</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#34d399' }}>{successTeam.villageName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase' }}>Squad Size</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff' }}>15 Players (11 A + 4 B)</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => setSelectedTeam(successTeam)}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              View 15-Player Squad & Receipt
            </button>
            <button
              onClick={() => { setSuccessTeam(null); setActiveTab('teams'); }}
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              View All Registered Teams
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 1: REGISTRATION FORM
      ══════════════════════════════════════════════════ */}
      {activeTab === 'register' && !successTeam && (
        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Step 1: Taluka & Association */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', border: '1px solid #f1f5f9', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <MapPin size={18} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  1. Taluka & Association Selection
                </h3>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Taluka *
                </label>
                <select
                  value={taluka}
                  onChange={(e) => handleTalukaChange(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                >
                  {TALUKAS.map((t) => (
                    <option key={t} value={t}>
                      {t} (Taluka)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Governing Association *
                </label>
                <input
                  type="text"
                  required
                  value={association}
                  onChange={(e) => setAssociation(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Village Name (Compulsory) *
                </label>
                <input
                  type="text"
                  required
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  placeholder="e.g. Panvel Rural, Owale, Koproli"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Step 2: Village Team Name & Captain */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', border: '1px solid #f1f5f9', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Shield size={18} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  2. Team Name & Captain Contact
                </h3>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Official Team Name (Compulsory) *
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Panvel Village Tigers"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Captain Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                    placeholder="e.g. Sachin Patil"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Captain Mobile (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={captainMobile}
                    onChange={(e) => setCaptainMobile(e.target.value)}
                    placeholder="+91 98201 XXXXX"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Captain Email (Optional)
                </label>
                <input
                  type="email"
                  value={captainEmail}
                  onChange={(e) => setCaptainEmail(e.target.value)}
                  placeholder="captain@villageleague.in"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Step 3: Fee (500 Rs) & Payment Proof */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', border: '1px solid #a7f3d0', padding: '1.5rem', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#10b981" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    3. League Fee (500 Rs Compulsory)
                  </h3>
                </div>
                <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#047857' }}>
                  ₹500.00
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                >
                  <option value="UPI (PhonePe / GPay / Paytm)">UPI (PhonePe / GPay / Paytm)</option>
                  <option value="Cash to Taluka Association">Cash to Taluka Association Official</option>
                  <option value="Bank Transfer (NEFT / IMPS)">Bank Transfer (NEFT / IMPS)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Payment Receipt Screenshot *
                </label>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '12px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  {paymentScreenshotUrl && (
                    <img
                      src={paymentScreenshotUrl}
                      alt="Receipt"
                      style={{ width: '100%', maxHeight: '90px', objectFit: 'contain', borderRadius: '6px', marginBottom: '8px' }}
                    />
                  )}
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Upload size={13} />
                    <span>Upload Screenshot</span>
                    <input type="file" accept="image/*" onChange={handleScreenshotUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              STEP 4: COMPULSORY 15 PLAYERS ROSTER (A & B PLAYERS)
          ══════════════════════════════════════════════════ */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="#10b981" />
                  <span>4. Compulsory 15-Player Squad (11 A-Players + 4 B-Reserves)</span>
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  As per Village Premium League regulations: Player 1-11 are Playing XI (A-Players), Player 12-15 are Reserves (B-Players).
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                  11 Playing XI (A)
                </span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                  4 Reserves (B)
                </span>
              </div>
            </div>

            {/* Players Grid Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>#</th>
                    <th style={{ padding: '10px 12px' }}>Player Name</th>
                    <th style={{ padding: '10px 12px' }}>Playing Role</th>
                    <th style={{ padding: '10px 12px' }}>T-Shirt</th>
                    <th style={{ padding: '10px 12px' }}>Pant Waist</th>
                    <th style={{ padding: '10px 12px' }}>Mobile</th>
                    <th style={{ padding: '10px 12px' }}>Squad Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p, idx) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: p.isReserve ? 'rgba(254, 243, 199, 0.2)' : idx % 2 === 0 ? '#ffffff' : '#fcfcfd'
                      }}
                    >
                      <td style={{ padding: '8px 12px', fontWeight: 800, color: '#0f172a' }}>
                        {p.id}
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => updatePlayerField(idx, 'name', e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', width: '160px' }}
                          />
                          {p.isCaptain && <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#10b981', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>C</span>}
                          {p.isViceCaptain && <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#3b82f6', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>VC</span>}
                        </div>
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <select
                          value={p.role}
                          onChange={(e) => updatePlayerField(idx, 'role', e.target.value)}
                          style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                        >
                          <option value="Batsman">Batsman</option>
                          <option value="Bowler">Bowler</option>
                          <option value="Allrounder">Allrounder</option>
                          <option value="Wicket-Keeper">Wicket-Keeper</option>
                        </select>
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <select
                          value={p.tshirtSize}
                          onChange={(e) => updatePlayerField(idx, 'tshirtSize', e.target.value)}
                          style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                        >
                          {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <select
                          value={p.pantSize}
                          onChange={(e) => updatePlayerField(idx, 'pantSize', e.target.value)}
                          style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                        >
                          {['28', '30', '32', '34', '36', '38', '40'].map((sz) => (
                            <option key={sz} value={sz}>{sz}″</option>
                          ))}
                        </select>
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <input
                          type="tel"
                          value={p.mobile}
                          onChange={(e) => updatePlayerField(idx, 'mobile', e.target.value)}
                          style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', width: '130px' }}
                        />
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          backgroundColor: p.isReserve ? '#fef3c7' : '#ecfdf5',
                          color: p.isReserve ? '#b45309' : '#047857',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {p.isReserve ? 'B Player (Reserve)' : 'A Player (Playing XI)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 36px',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <Trophy size={20} />
              <span>{loading ? 'Registering Team...' : 'Submit Village Team & Pay ₹500 League Fee'}</span>
            </button>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
              Instant verification by Taluka Cricket Association • Match kit dispatched prior to tournament
            </div>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 2: REGISTERED TEAMS DIRECTORY
      ══════════════════════════════════════════════════ */}
      {activeTab === 'teams' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                Village Premium League — Registered Teams
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                Teams verified for the 2026 Taluka League knockout stage.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 14px', width: '280px' }}>
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search village, team or taluka..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.8125rem', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1.25rem',
                  border: '1px solid #f1f5f9',
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '4px' }}>
                        {team.taluka} Taluka
                      </span>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                        {team.teamName}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Village: <strong>{team.villageName}</strong> • {team.association}
                      </div>
                    </div>

                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '6px' }}>
                      PAID ₹500
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px 12px', fontSize: '0.75rem', color: '#475569', marginBottom: '12px' }}>
                    <div>Captain: <strong>{team.captainName}</strong> ({team.captainMobile})</div>
                    <div>Squad: <strong>{team.players?.length || 15} Players</strong> (11 Playing XI + 4 Reserves)</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTeam(team)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={13} />
                  <span>View 15-Player Squad & Certificate</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TEAM 15-PLAYER DETAILS MODAL
      ══════════════════════════════════════════════════ */}
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
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 2px 0' }}>
                  {selectedTeam.teamName}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {selectedTeam.taluka} Taluka • {selectedTeam.association} • Village: {selectedTeam.villageName}
                </div>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857' }}>ENTRY PASS VERIFIED:</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 900, color: '#065f46', marginLeft: '6px' }}>{selectedTeam.registrationId}</span>
              </div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#047857', backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
                ₹500 PAID
              </span>
            </div>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Official 15-Player Squad:
            </h4>

            <div style={{ maxHeight: '340px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>#</th>
                    <th style={{ padding: '8px' }}>Name</th>
                    <th style={{ padding: '8px' }}>Role</th>
                    <th style={{ padding: '8px' }}>Kit Sizes</th>
                    <th style={{ padding: '8px' }}>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTeam.players?.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px', fontWeight: 700 }}>{idx + 1}</td>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#0f172a' }}>
                        {p.name} {p.isCaptain && '(C)'} {p.isViceCaptain && '(VC)'}
                      </td>
                      <td style={{ padding: '8px', color: '#64748b' }}>{p.role}</td>
                      <td style={{ padding: '8px' }}>T-Shirt: {p.tshirtSize} | Pant: {p.pantSize}″</td>
                      <td style={{ padding: '8px' }}>
                        <span style={{
                          fontSize: '0.625rem',
                          fontWeight: 800,
                          backgroundColor: p.isReserve ? '#fef3c7' : '#ecfdf5',
                          color: p.isReserve ? '#b45309' : '#047857',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {p.isReserve ? 'B-Reserve' : 'A-Playing XI'}
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
              Close Squad Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
