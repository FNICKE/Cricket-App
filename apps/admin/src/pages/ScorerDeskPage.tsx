import { useState, useEffect, useCallback, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { ExternalLink, LogOut, ShieldCheck } from 'lucide-react';
import { API_BASE } from '../constants';
import type { AdminOverview, AdminSession, CommentaryItem, MatchState } from '../types';
import SuperAdminPage from './SuperAdminPage';
import PlayerSubscriptionsPage from './PlayerSubscriptionsPage';
import ScoringPage from './ScoringPage';

export default function ScorerDeskPage({ session, onLogout }: { session: AdminSession; onLogout: () => void }) {
  const [adminView, setAdminView] = useState<'scoring' | 'registrations' | 'overview'>(
    session.user.role === 'super_admin' ? 'overview' : 'scoring'
  );
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [overviewError, setOverviewError] = useState('');
  const authHeaders = { Authorization: `Bearer ${session.token}` };

  const [match, setMatch] = useState<MatchState | null>(null);
  const [commentary, setCommentary] = useState<CommentaryItem[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [commentaryInput, setCommentaryInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [dismissalType, setDismissalType] = useState('caught');
  const [outPlayerType, setOutPlayerType] = useState<'striker' | 'nonStriker'>('striker');
  const [fielderName, setFielderName] = useState('Pant');

  const [showExtraModal, setShowExtraModal] = useState(false);
  const [selectedExtraType, setSelectedExtraType] = useState<'wd' | 'nb' | 'b' | 'lb'>('wd');
  const [extraRuns, setExtraRuns] = useState(0);

  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [nextBowlerId, setNextBowlerId] = useState(7);

  const socketRef = useRef<Socket | null>(null);

  const fetchMatchData = useCallback(async () => {
    try {
      const [liveRes, commRes] = await Promise.all([
        fetch(`${API_BASE}/matches/1/live`),
        fetch(`${API_BASE}/matches/1/commentary`)
      ]);
      if (liveRes.ok) setMatch(await liveRes.json());
      if (commRes.ok) {
        const commData = await commRes.json();
        setCommentary(commData.commentary || []);
      }
    } catch (err) {
      console.warn('Initial fetch error, waiting for API...', err);
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/registrations`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      } else {
        const data = await res.json();
        console.error('Could not load registrations:', data.message);
      }
    } catch (err) {
      console.warn('Error fetching registrations:', err);
    }
  }, [session.token]);

  const fetchOverview = useCallback(async () => {
    setOverviewError('');
    try {
      const res = await fetch(`${API_BASE}/admin/auth/overview`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not load the admin overview.');
      setOverview(data);
    } catch (err) {
      setOverviewError(err instanceof Error ? err.message : 'Could not load the admin overview.');
    }
  }, [session.token]);

  const handleUpdateStatus = async (id: number, status: 'paid' | 'pending' | 'expired') => {
    try {
      const res = await fetch(`${API_BASE}/players/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchRegistrations();
      } else {
        const data = await res.json();
        console.error('Could not update registration:', data.message);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useEffect(() => {
    if (adminView === 'registrations') fetchRegistrations();
    if (adminView === 'overview') fetchOverview();
  }, [adminView, fetchOverview, fetchRegistrations]);

  useEffect(() => {
    fetchMatchData();

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
  }, [fetchMatchData]);

  const scoreBall = async (ballData: {
    runsBat: number;
    extraType?: string | null;
    extraRuns?: number;
    isFour?: boolean;
    isSix?: boolean;
    isWicket?: boolean;
    dismissalType?: string;
    commentary?: string;
  }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...ballData,
        commentary: commentaryInput.trim() || ballData.commentary
      };

      const res = await fetch(`${API_BASE}/admin/matches/1/balls`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setMatch(data.state);
        setCommentaryInput('');
      }
    } catch (err) {
      console.error('Failed to score ball:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const undoBall = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/matches/1/balls/last`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (res.ok) {
        const data = await res.json();
        setMatch(data.state);
      }
    } catch (err) {
      console.error('Undo failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const swapStrike = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/matches/1/swap-strike`, {
        method: 'POST',
        headers: authHeaders
      });
      if (res.ok) {
        const data = await res.json();
        setMatch(data.state);
      }
    } catch (err) {
      console.error('Swap strike failed:', err);
    }
  };

  const changeBowler = async (bowlerId: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/matches/1/next-bowler`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ bowlerId })
      });
      if (res.ok) {
        const data = await res.json();
        setMatch(data.state);
        setShowBowlerModal(false);
      }
    } catch (err) {
      console.error('Change bowler failed:', err);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '0':
          scoreBall({ runsBat: 0 });
          break;
        case '1':
          scoreBall({ runsBat: 1 });
          break;
        case '2':
          scoreBall({ runsBat: 2 });
          break;
        case '3':
          scoreBall({ runsBat: 3 });
          break;
        case '4':
          scoreBall({ runsBat: 4, isFour: true });
          break;
        case '6':
          scoreBall({ runsBat: 6, isSix: true });
          break;
        case 'w':
        case 'W':
          setShowWicketModal(true);
          break;
        case 'd':
        case 'D':
          setSelectedExtraType('wd');
          setShowExtraModal(true);
          break;
        case 'n':
        case 'N':
          setSelectedExtraType('nb');
          setShowExtraModal(true);
          break;
        case 's':
        case 'S':
          swapStrike();
          break;
        case 'u':
        case 'U':
          undoBall();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, commentaryInput]);

  const currentInnings = match?.currentInnings;
  const striker = currentInnings?.battingScores?.find((b) => b.isOnStrike) || currentInnings?.battingScores?.[3];
  const nonStriker = currentInnings?.battingScores?.find((b) => b.isBatting && !b.isOnStrike) || currentInnings?.battingScores?.[4];
  const bowler = currentInnings?.bowlingFigures?.find((b) => b.isBowling) || currentInnings?.bowlingFigures?.[1];

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
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.025em', color: '#0f172a' }}>
                TASK<span style={{ color: '#10b981' }}>SCORER</span>
              </span>
              <span style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                border: '1px solid #a7f3d0',
                padding: '2px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ADMIN DESK
              </span>
            </div>
          </div>
        </div>

        {/* Center switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setAdminView('scoring')}
            style={{
              backgroundColor: adminView === 'scoring' ? '#0f172a' : '#f8fafc',
              color: adminView === 'scoring' ? '#ffffff' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Live Scoring Desk
          </button>

          {session.user.role === 'super_admin' && (
            <button
              onClick={() => setAdminView('overview')}
              style={{
                backgroundColor: adminView === 'overview' ? '#10b981' : '#f8fafc',
                color: adminView === 'overview' ? '#ffffff' : '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Super Admin
            </button>
          )}

          {session.user.role === 'super_admin' && (
            <button
              onClick={() => setAdminView('registrations')}
              style={{
                backgroundColor: adminView === 'registrations' ? '#10b981' : '#f8fafc',
                color: adminView === 'registrations' ? '#ffffff' : '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Player Subscriptions</span>
              <span style={{ fontSize: '0.625rem', backgroundColor: adminView === 'registrations' ? '#065f46' : '#ecfdf5', color: adminView === 'registrations' ? '#fff' : '#10b981', padding: '1px 6px', borderRadius: '4px' }}>
                {registrations.length}
              </span>
            </button>
          )}
        </div>

        {/* Right Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            {socketConnected ? 'Scorer Online' : 'Offline'}
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f1f5f9',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <span>View Fan Portal</span>
            <ExternalLink size={13} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>{session.user.fullName}</span>
            <button
              onClick={onLogout}
              title="Sign out"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 9px', background: '#fff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          PAGE CONTENT
      ══════════════════════════════════════════════════ */}
      {adminView === 'overview' && session.user.role === 'super_admin' ? (
        <SuperAdminPage overview={overview} overviewError={overviewError} sessionToken={session.token} onRefresh={fetchOverview} />
      ) : adminView === 'registrations' && session.user.role === 'super_admin' ? (
        <PlayerSubscriptionsPage registrations={registrations} onRefresh={fetchRegistrations} onUpdateStatus={handleUpdateStatus} />
      ) : (
        <ScoringPage
          currentInnings={currentInnings}
          striker={striker}
          nonStriker={nonStriker}
          bowler={bowler}
          commentary={commentary}
          commentaryInput={commentaryInput}
          setCommentaryInput={setCommentaryInput}
          isSubmitting={isSubmitting}
          scoreBall={scoreBall}
          undoBall={undoBall}
          swapStrike={swapStrike}
          changeBowler={changeBowler}
          showWicketModal={showWicketModal}
          setShowWicketModal={setShowWicketModal}
          dismissalType={dismissalType}
          setDismissalType={setDismissalType}
          outPlayerType={outPlayerType}
          setOutPlayerType={setOutPlayerType}
          fielderName={fielderName}
          setFielderName={setFielderName}
          showExtraModal={showExtraModal}
          setShowExtraModal={setShowExtraModal}
          selectedExtraType={selectedExtraType}
          setSelectedExtraType={setSelectedExtraType}
          extraRuns={extraRuns}
          setExtraRuns={setExtraRuns}
          showBowlerModal={showBowlerModal}
          setShowBowlerModal={setShowBowlerModal}
          nextBowlerId={nextBowlerId}
          setNextBowlerId={setNextBowlerId}
        />
      )}

    </div>
  );
}
