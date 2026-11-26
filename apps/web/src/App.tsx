import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import PlayerRegistrationPage from './PlayerRegistrationPage.tsx';
import PlayerLoginPage from './PlayerLoginPage.tsx';
import PlayerProfilePage, { PlayerRegistration } from './PlayerProfilePage.tsx';
import VillageLeaguePage from './pages/VillageLeaguePage.tsx';
import SchedulePage from './pages/SchedulePage.tsx';
import RecentMatchesPage from './pages/RecentMatchesPage.tsx';
import ActiveMatchesPage from './pages/ActiveMatchesPage.tsx';
import NewsPage from './pages/NewsPage.tsx';
import SeriesPage from './pages/SeriesPage.tsx';
import TeamsPage from './pages/TeamsPage.tsx';
import VideosPage from './pages/VideosPage.tsx';
import RankingsBestTeamPage from './pages/RankingsBestTeamPage.tsx';
import MorePage from './pages/MorePage.tsx';
import {
  Activity,
  Flame,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  Radio,
  ExternalLink,
  Shield,
  Zap,
  UserPlus,
  User,
  LogIn,
  LogOut,
  Eye,
  CheckCircle2,
  Trophy,
  Newspaper,
  Film,
  Star
} from 'lucide-react';

interface BattingScore {
  playerId: number;
  playerName: string;
  battingOrder: number;
  runs: number;
  balls: number;
  dotBalls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissalText?: string;
  isOut: boolean;
  isOnStrike: boolean;
  isBatting: boolean;
}

interface BowlingFigure {
  playerId: number;
  playerName: string;
  legalBalls: number;
  oversDisplay: string;
  maidens: number;
  runs: number;
  wickets: number;
  wides: number;
  noBalls: number;
  economy: number;
  isBowling: boolean;
}

interface InningsState {
  id: number;
  inningsNo: number;
  battingTeamName: string;
  bowlingTeamName: string;
  battingTeamShort: string;
  bowlingTeamShort: string;
  runs: number;
  wickets: number;
  oversDisplay: string;
  crr: number;
  rrr?: number;
  target?: number;
  neededRuns?: number;
  ballsRemaining?: number;
  status: string;
  battingScores: BattingScore[];
  bowlingFigures: BowlingFigure[];
  currentPartnership?: {
    totalRuns: number;
    totalBalls: number;
    player1Name: string;
    player1Runs: number;
    player2Name: string;
    player2Runs: number;
  };
  fallOfWickets?: Array<{
    wicketNo: number;
    playerName: string;
    score: number;
    overDisplay: string;
  }>;
  recentBalls: string[];
  strikerId?: number;
  nonStrikerId?: number;
  currentBowlerId?: number;
}

interface MatchState {
  matchId: number;
  seriesName: string;
  matchNo: string;
  format: string;
  venueName: string;
  venueCity: string;
  teamA: { shortName: string; name: string };
  teamB: { shortName: string; name: string };
  status: string;
  statusNote?: string;
  resultText?: string;
  currentInnings?: InningsState;
  innings: InningsState[];
  version: number;
}

interface CommentaryItem {
  id: number;
  headline?: string;
  text: string;
  runs?: number;
  isWicket?: boolean;
  isBoundary?: boolean;
}

const API_BASE = 'http://localhost:4000/api/v1';

type PageName =
  | 'match-centre'
  | 'schedule'
  | 'recent'
  | 'active'
  | 'news'
  | 'series'
  | 'teams'
  | 'videos'
  | 'rankings'
  | 'more'
  | 'village-league'
  | 'registration'
  | 'login'
  | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>('match-centre');
  const [loggedInPlayer, setLoggedInPlayer] = useState<PlayerRegistration | null>(() => {
    try {
      const saved = localStorage.getItem('cricverse_player');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (player: PlayerRegistration) => {
    setLoggedInPlayer(player);
    try {
      localStorage.setItem('cricverse_player', JSON.stringify(player));
    } catch {}
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    setLoggedInPlayer(null);
    try {
      localStorage.removeItem('cricverse_player');
    } catch {}
    setCurrentPage('match-centre');
  };

  const handlePlayerUpdated = (updated: PlayerRegistration) => {
    setLoggedInPlayer(updated);
    try {
      localStorage.setItem('cricverse_player', JSON.stringify(updated));
    } catch {}
  };
  const [match, setMatch] = useState<MatchState | null>(null);
  const [commentary, setCommentary] = useState<CommentaryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'scorecard' | 'squads' | 'table' | 'info'>('live');
  const [activeScorecardInnings, setActiveScorecardInnings] = useState<number>(2);
  const [socketConnected, setSocketConnected] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [liveRes, commRes, tableRes] = await Promise.all([
          fetch(`${API_BASE}/matches/1/live`),
          fetch(`${API_BASE}/matches/1/commentary`),
          fetch(`${API_BASE}/points-table`)
        ]);

        if (liveRes.ok) setMatch(await liveRes.json());
        if (commRes.ok) {
          const cd = await commRes.json();
          setCommentary(cd.commentary || []);
        }
        if (tableRes.ok) {
          const td = await tableRes.json();
          setTableData(td.table || []);
        }
      } catch (err) {
        console.warn('API connecting...', err);
      }
    };

    loadData();

    const socket = io('http://localhost:4000');
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('match:subscribe', { matchId: 1 });
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('match:snapshot', (snapshot: MatchState) => {
      setMatch(snapshot);
    });

    socket.on('ball:new', (payload: { state: MatchState }) => {
      setMatch(payload.state);
      fetch(`${API_BASE}/matches/1/commentary`)
        .then((r) => r.json())
        .then((d) => setCommentary(d.commentary || []))
        .catch(() => {});
    });

    socket.on('ball:undo', (payload: { state: MatchState }) => {
      setMatch(payload.state);
      fetch(`${API_BASE}/matches/1/commentary`)
        .then((r) => r.json())
        .then((d) => setCommentary(d.commentary || []))
        .catch(() => {});
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const currentInnings = match?.currentInnings;
  const striker = currentInnings?.battingScores?.find((b) => b.isOnStrike) || currentInnings?.battingScores?.[3];
  const nonStriker = currentInnings?.battingScores?.find((b) => b.isBatting && !b.isOnStrike) || currentInnings?.battingScores?.[4];
  const bowler = currentInnings?.bowlingFigures?.find((b) => b.isBowling) || currentInnings?.bowlingFigures?.[1];

  const scorecardInnings = match?.innings?.find((i) => i.inningsNo === activeScorecardInnings) || match?.innings?.[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* ══════════════════════════════════════════════════
          TOPBAR (TaskVerse Header Style)
      ══════════════════════════════════════════════════ */}
      <header style={{
        height: '3.75rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1rem, 3.5vw, 2rem)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.25)'
          }}>
            <Zap size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.025em', color: '#0f172a' }}>
                CRIC<span style={{ color: '#10b981' }}>VERSE</span>
              </span>
              <span style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                border: '1px solid #a7f3d0',
                padding: '2px 6px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Live Hub
              </span>
            </div>
          </div>
        </div>

        {/* Center Nav Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Village League (500 Rs) Highlighted Pill */}
          <button
            onClick={() => setCurrentPage('village-league')}
            style={{
              backgroundColor: currentPage === 'village-league' ? '#047857' : '#ecfdf5',
              color: currentPage === 'village-league' ? '#ffffff' : '#047857',
              border: '1px solid #a7f3d0',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.15)',
              transition: 'all 0.15s ease'
            }}
          >
            <Trophy size={14} />
            <span>Village League</span>
            <span style={{ fontSize: '0.625rem', backgroundColor: currentPage === 'village-league' ? '#10b981' : '#10b981', color: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>
              ₹500
            </span>
          </button>

          {/* 1-Year Player Pass Registration */}
          <button
            onClick={() => setCurrentPage('registration')}
            style={{
              backgroundColor: currentPage === 'registration' ? '#0f172a' : '#f8fafc',
              color: currentPage === 'registration' ? '#ffffff' : '#334155',
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={14} />
            <span>Player Pass</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {loggedInPlayer ? (
            /* Logged in Player Pill */
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  padding: '4px 10px 4px 4px',
                  borderRadius: '9999px',
                  cursor: 'pointer'
                }}
                title="View your profile"
              >
                <img
                  src={loggedInPlayer.photoUrl}
                  alt={loggedInPlayer.fullName}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop';
                  }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>
                  {loggedInPlayer.fullName}
                </span>
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  backgroundColor: loggedInPlayer.isExpired ? '#fef2f2' : '#ecfdf5',
                  color: loggedInPlayer.isExpired ? '#dc2626' : '#047857',
                  padding: '1px 6px',
                  borderRadius: '4px'
                }}>
                  {loggedInPlayer.membershipId}
                </span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.6875rem',
                  fontWeight: 700
                }}
                title="Logout to Viewer Mode"
              >
                <LogOut size={13} />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            /* Viewer Mode Actions */
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage('login')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <LogIn size={13} />
                <span>Player Login</span>
              </button>
            </div>
          )}

          {/* Socket Pulse Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: socketConnected ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${socketConnected ? '#a7f3d0' : '#fecaca'}`,
            color: socketConnected ? '#059669' : '#dc2626',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.6875rem',
            fontWeight: 700
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: socketConnected ? '#10b981' : '#ef4444'
            }}></span>
            {socketConnected ? 'Live' : 'Syncing'}
          </div>

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <span>Scorer Desk</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          SECONDARY NAVIGATION STRIP (ALL 10 PAGES FROM HANDWRITTEN SPEC)
      ══════════════════════════════════════════════════ */}
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        padding: '0 clamp(1rem, 3.5vw, 2rem)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        overflowX: 'auto',
        position: 'sticky',
        top: '3.75rem',
        zIndex: 90
      }} className="scrollbar-hide">
        {[
          { id: 'match-centre', label: '1. Live Score', icon: Zap },
          { id: 'schedule', label: '2. Schedule', icon: Calendar },
          { id: 'recent', label: '3. Recent Matches', icon: Award },
          { id: 'active', label: '4. Active Matches', icon: Activity },
          { id: 'news', label: '5. News', icon: Newspaper },
          { id: 'series', label: '6. Series', icon: Trophy },
          { id: 'teams', label: '7. Teams', icon: Shield },
          { id: 'videos', label: '8. Videos', icon: Film },
          { id: 'rankings', label: '9. Ranking & Best Team', icon: Star },
          { id: 'more', label: '10. More', icon: Layers }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as PageName)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#047857' : '#64748b',
                border: 'none',
                borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} color={isActive ? '#10b981' : '#94a3b8'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* RENDER CURRENT VIEW */}
      {currentPage === 'schedule' ? (
        <SchedulePage onSelectMatch={() => setCurrentPage('match-centre')} />
      ) : currentPage === 'recent' ? (
        <RecentMatchesPage onSelectMatch={() => setCurrentPage('match-centre')} />
      ) : currentPage === 'active' ? (
        <ActiveMatchesPage onSelectMatch={() => setCurrentPage('match-centre')} />
      ) : currentPage === 'news' ? (
        <NewsPage />
      ) : currentPage === 'series' ? (
        <SeriesPage />
      ) : currentPage === 'teams' ? (
        <TeamsPage />
      ) : currentPage === 'videos' ? (
        <VideosPage />
      ) : currentPage === 'rankings' ? (
        <RankingsBestTeamPage />
      ) : currentPage === 'more' ? (
        <MorePage />
      ) : currentPage === 'village-league' ? (
        <VillageLeaguePage />
      ) : currentPage === 'registration' ? (
        <PlayerRegistrationPage
          onRegisteredLogin={handleLoginSuccess}
        />
      ) : currentPage === 'login' ? (
        <PlayerLoginPage
          onLoginSuccess={handleLoginSuccess}
          onContinueAsViewer={() => setCurrentPage('match-centre')}
          onNavigateToRegister={() => setCurrentPage('registration')}
        />
      ) : currentPage === 'profile' && loggedInPlayer ? (
        <PlayerProfilePage
          player={loggedInPlayer}
          onLogout={handleLogout}
          onNavigateToMatchCentre={() => setCurrentPage('match-centre')}
          onPlayerUpdated={handlePlayerUpdated}
        />
      ) : (
        <>
          {/* ══════════════════════════════════════════════════
              SCORE TICKER CAROUSEL (TaskVerse Pill Cards)
          ══════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        padding: '12px clamp(1rem, 3.5vw, 2rem)',
        display: 'flex',
        gap: '14px',
        overflowX: 'auto'
      }} className="scrollbar-hide">
        {/* Card 1: India vs Australia (Live) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1.5px solid #10b981',
          padding: '12px 16px',
          minWidth: '280px',
          boxShadow: '0 4px 12px -2px rgba(16, 185, 129, 0.12)',
          cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              T20 WC &bull; Super 8
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              border: '1px solid #fecaca',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.625rem',
              fontWeight: 800
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
              LIVE
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '2px' }}>
            <span>IND</span>
            <span>186/5 (20.0)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
            <span>AUS</span>
            <span style={{ color: '#10b981' }}>
              {currentInnings?.runs ?? 145}/{currentInnings?.wickets ?? 3} ({currentInnings?.oversDisplay ?? '16.2'} ov)
            </span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#f59e0b', fontWeight: 600, marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {match?.statusNote || 'Australia need 42 runs in 22 balls'}
          </div>
        </div>

        {/* Card 2: South Africa vs England (Result) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          padding: '12px 16px',
          minWidth: '250px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
            T20 WC &bull; Match Completed
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '2px' }}>
            <span>SA</span>
            <span>178/6 (20.0)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
            <span>ENG</span>
            <span>164/8 (20.0)</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600, marginTop: '6px' }}>
            South Africa won by 14 runs
          </div>
        </div>

        {/* Card 3: CSK vs MI (Upcoming) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          padding: '12px 16px',
          minWidth: '250px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
            IPL 2026 &bull; Match 1
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '2px' }}>
            <span>CSK</span>
            <span style={{ color: '#94a3b8' }}>Tomorrow</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
            <span>MI</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>19:30 IST</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600, marginTop: '6px' }}>
            Wankhede Stadium, Mumbai
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MAIN PAGE CONTENT (Fluid padding clamp)
      ══════════════════════════════════════════════════ */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 2.5vw, 1.75rem) clamp(0.75rem, 3.5vw, 2rem)' }}>

        {/* 1. TASKVERSE STAT CARDS (4-Column Key Metrics) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '20px'
        }}>
          {/* Target */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Target Score</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1 }}>{currentInnings?.target ?? 187}</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>From 120 balls</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6' }}>
              <Award size={20} />
            </div>
          </div>

          {/* CRR */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Current Run Rate</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#10b981', margin: 0, lineHeight: 1 }}>{currentInnings?.crr ?? '8.88'}</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>Runs per over</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <TrendingUp size={20} />
            </div>
          </div>

          {/* RRR */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Required Run Rate</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#f59e0b', margin: 0, lineHeight: 1 }}>{currentInnings?.rrr ?? '11.45'}</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>Need 42 off 22</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#f59e0b' }}>
              <Flame size={20} />
            </div>
          </div>

          {/* Overs & Balls */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Overs Bowled</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1 }}>
                {currentInnings?.oversDisplay ?? '16.2'} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#94a3b8' }}>/ 20</span>
              </p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>22 balls remaining</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* 2. MATCH HERO CARD (TaskVerse White Border Card) */}
        <div className="tv-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {match?.seriesName || "ICC Men's T20 World Cup 2026"} &bull; {match?.matchNo || 'Match 28 - Super 8'}
              </span>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                {match?.venueName || 'Wankhede Stadium, Mumbai'} &bull; Toss: Australia won, elected to bowl
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                border: '1px solid #a7f3d0',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                T20 International
              </span>
            </div>
          </div>

          {/* Teams Score Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px' }}>
            {/* Team A: India */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              borderRadius: '14px',
              padding: '16px 20px',
              borderLeft: '4px solid #0284c7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>India</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>1st Innings</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0' }}>
                186/5 <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>(20.0 ov)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Kohli 62 (44) &bull; Rohit 48 (28)</div>
            </div>

            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#64748b'
            }}>
              VS
            </div>

            {/* Team B: Australia (Live Chase) */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '14px',
              padding: '16px 20px',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>Australia (Chasing 187)</span>
                <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '4px' }}>LIVE</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', margin: '4px 0 2px 0' }}>
                {currentInnings?.runs ?? 145}/{currentInnings?.wickets ?? 3}{' '}
                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b' }}>
                  ({currentInnings?.oversDisplay ?? '16.2'} ov)
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>
                {match?.statusNote || `Need ${currentInnings?.neededRuns ?? 42} runs in ${currentInnings?.ballsRemaining ?? 22} balls`}
              </div>
            </div>
          </div>

          {/* Win Probability Bar (TaskVerse clean meter) */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
              <Shield size={14} className="text-emerald-500" />
              <span>Win Probability:</span>
              <span style={{ color: '#0284c7' }}>India 58%</span>
              <span>vs</span>
              <span style={{ color: '#f59e0b' }}>Australia 42%</span>
            </div>

            <div style={{ width: '220px', height: '8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '58%', backgroundColor: '#0284c7' }}></div>
              <div style={{ width: '42%', backgroundColor: '#f59e0b' }}></div>
            </div>
          </div>
        </div>

        {/* 3. TASKVERSE TAB BAR */}
        <div style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '20px',
          paddingBottom: '8px',
          overflowX: 'auto'
        }} className="scrollbar-hide">
          {[
            { id: 'live', label: 'Live Commentary' },
            { id: 'scorecard', label: 'Full Scorecard' },
            { id: 'squads', label: 'Playing XI Squads' },
            { id: 'table', label: 'Points Table' },
            { id: 'info', label: 'Match Info' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                backgroundColor: activeTab === tab.id ? '#10b981' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#64748b',
                border: activeTab === tab.id ? '1px solid #10b981' : '1px solid #f1f5f9',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 2px 4px rgba(16, 185, 129, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            TAB: LIVE (Crease, Bowler & Ball Stream)
        ══════════════════════════════════════════════════ */}
        {activeTab === 'live' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Batters Card */}
              <div className="tv-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} className="text-emerald-500" />
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>At The Crease</h3>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Australia Batting</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ color: '#94a3b8', borderBottom: '1px solid #f1f5f9', textAlign: 'left', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '6px 8px' }}>Batter</th>
                        <th style={{ padding: '6px 8px', textAlign: 'right' }}>R</th>
                        <th style={{ padding: '6px 8px', textAlign: 'right' }}>B</th>
                        <th style={{ padding: '6px 8px', textAlign: 'right' }}>4s</th>
                        <th style={{ padding: '6px 8px', textAlign: 'right' }}>6s</th>
                        <th style={{ padding: '6px 8px', textAlign: 'right' }}>SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Striker */}
                      <tr style={{ backgroundColor: '#ecfdf5', borderRadius: '8px' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 800, color: '#065f46' }}>
                          🏏 {striker?.playerName || 'Glenn Maxwell'}
                          <span style={{ marginLeft: '6px', fontSize: '0.5625rem', backgroundColor: '#10b981', color: '#fff', padding: '2px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>Strike</span>
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 900, color: '#10b981' }}>{striker?.runs ?? 34}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748b' }}>{striker?.balls ?? 18}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748b' }}>{striker?.fours ?? 3}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748b' }}>{striker?.sixes ?? 2}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#065f46' }}>{striker?.strikeRate ?? 188.89}</td>
                      </tr>

                      {/* Non-Striker */}
                      <tr style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 700, color: '#0f172a' }}>
                          {nonStriker?.playerName || 'Marcus Stoinis'}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>{nonStriker?.runs ?? 18}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748b' }}>{nonStriker?.balls ?? 12}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748b' }}>{nonStriker?.fours ?? 1}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748b' }}>{nonStriker?.sixes ?? 1}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#64748b' }}>{nonStriker?.strikeRate ?? 150.00}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Partnership Bar */}
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                  <span><strong>Partnership:</strong> {currentInnings?.currentPartnership?.totalRuns ?? 52} runs ({currentInnings?.currentPartnership?.totalBalls ?? 30} balls)</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>4th Wicket</span>
                </div>
              </div>

              {/* Bowler Card & Recent Deliveries */}
              <div className="tv-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={16} className="text-amber-500" />
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Current Bowler</h3>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>India Bowling</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0f172a' }}>
                      ⚡ {bowler?.playerName || 'Jasprit Bumrah'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Econ: {bowler?.economy ?? 6.60} &bull; Overs: {bowler?.oversDisplay ?? '3.2'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#dc2626' }}>
                      {bowler?.wickets ?? 1} / {bowler?.runs ?? 22}
                    </div>
                  </div>
                </div>

                {/* Recent Balls Strip */}
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Recent Balls:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {(currentInnings?.recentBalls || ['1', '4', '0', '6', '1', '2', '|', '0', '1']).map((b, idx) => {
                      if (b === '|') return <span key={idx} style={{ color: '#cbd5e1', fontWeight: 700 }}>|</span>;
                      const isW = b === 'W';
                      const is6 = b === '6';
                      const is4 = b === '4';
                      const is0 = b === '0' || b === '•';
                      const bg = isW ? '#fee2e2' : is6 ? '#f3e8ff' : is4 ? '#dcfce7' : is0 ? '#f1f5f9' : '#e0f2fe';
                      const textCol = isW ? '#dc2626' : is6 ? '#7e22ce' : is4 ? '#15803d' : is0 ? '#64748b' : '#0369a1';
                      return (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: bg,
                            color: textCol,
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${bg}`
                          }}
                        >
                          {b}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Commentary Stream */}
            <div className="tv-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} className="text-emerald-500" />
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Live Ball-by-Ball Feed
                  </h3>
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 700 }}>Real-Time Stream</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {commentary.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: item.isWicket ? '#fef2f2' : item.isBoundary ? '#f0fdf4' : '#ffffff',
                      borderLeft: `4px solid ${item.isWicket ? '#ef4444' : item.isBoundary ? '#10b981' : '#e2e8f0'}`,
                      border: '1px solid #f1f5f9',
                      borderLeftWidth: '4px',
                      borderRadius: '10px',
                      padding: '12px 16px'
                    }}
                  >
                    {item.headline && (
                      <div style={{
                        fontWeight: 800,
                        fontSize: '0.8125rem',
                        color: item.isWicket ? '#dc2626' : item.isBoundary ? '#15803d' : '#0f172a',
                        marginBottom: '2px'
                      }}>
                        {item.headline}
                      </div>
                    )}
                    <div style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5 }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: FULL SCORECARD
        ══════════════════════════════════════════════════ */}
        {activeTab === 'scorecard' && (
          <div>
            {/* Innings Selector Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => setActiveScorecardInnings(1)}
                style={{
                  backgroundColor: activeScorecardInnings === 1 ? '#0f172a' : '#ffffff',
                  color: activeScorecardInnings === 1 ? '#ffffff' : '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                1st Innings: India 186/5 (20.0 ov)
              </button>
              <button
                onClick={() => setActiveScorecardInnings(2)}
                style={{
                  backgroundColor: activeScorecardInnings === 2 ? '#0f172a' : '#ffffff',
                  color: activeScorecardInnings === 2 ? '#ffffff' : '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                2nd Innings: Australia {currentInnings?.runs ?? 145}/{currentInnings?.wickets ?? 3} ({currentInnings?.oversDisplay ?? '16.2'} ov)
              </button>
            </div>

            {/* Batting Card */}
            <div className="tv-card" style={{ padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '14px', color: '#0f172a' }}>
                Batting Scorecard — {scorecardInnings?.battingTeamName || 'India'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px' }}>Batter</th>
                      <th style={{ padding: '8px 12px' }}>Dismissal</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>R</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>B</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>4s</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>6s</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorecardInnings?.battingScores?.map((b) => (
                      <tr key={b.playerId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{b.playerName}</td>
                        <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '0.75rem' }}>{b.dismissalText || 'not out'}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#10b981' }}>{b.runs}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>{b.balls}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>{b.fours}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>{b.sixes}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{b.strikeRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling Card */}
            <div className="tv-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '14px', color: '#0f172a' }}>
                Bowling Figures — {scorecardInnings?.bowlingTeamName || 'Australia'}
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px' }}>Bowler</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>O</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>M</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>R</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>W</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorecardInnings?.bowlingFigures?.map((bw) => (
                      <tr key={bw.playerId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{bw.playerName}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>{bw.oversDisplay}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>{bw.maidens}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>{bw.runs}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#dc2626' }}>{bw.wickets}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{bw.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: POINTS TABLE
        ══════════════════════════════════════════════════ */}
        {activeTab === 'table' && (
          <div className="tv-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
              ICC Men's T20 World Cup 2026 — Points Table (Super 8)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px' }}>Team</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>P</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>W</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>L</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>NR</th>
                    <th style={{ padding: '10px', textAlign: 'center', fontWeight: 800, color: '#10b981' }}>Pts</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>NRR</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Form</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: row.qualified ? '#f0fdf4' : 'transparent' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {row.team.name}
                        {row.qualified && (
                          <span style={{ fontSize: '0.625rem', backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>QUALIFIED</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'center', color: '#64748b' }}>{row.p}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center', color: '#0f172a', fontWeight: 600 }}>{row.w}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center', color: '#64748b' }}>{row.l}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center', color: '#64748b' }}>{row.nr}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 800, color: '#10b981', fontSize: '0.9375rem' }}>{row.pts}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 600, color: '#64748b' }}>{row.nrr}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        {row.form?.map((f: string, i: number) => (
                          <span
                            key={i}
                            style={{
                              display: 'inline-block',
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              fontSize: '0.625rem',
                              fontWeight: 800,
                              lineHeight: '18px',
                              margin: '0 2px',
                              backgroundColor: f === 'W' ? '#dcfce7' : '#fee2e2',
                              color: f === 'W' ? '#16a34a' : '#dc2626'
                            }}
                          >
                            {f}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: MATCH INFO
        ══════════════════════════════════════════════════ */}
        {activeTab === 'info' && (
          <div className="tv-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>Match Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '0.8125rem' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Tournament</strong>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>ICC Men's T20 World Cup 2026</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Venue</strong>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Wankhede Stadium, Mumbai</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Toss</strong>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Australia won toss & elected to bowl</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Umpires</strong>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Richard Illingworth & Nitin Menon</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Match Referee</strong>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Javagal Srinath</span>
              </div>
            </div>
          </div>
        )}
      </main>
        </>
      )}
    </div>
  );
}
