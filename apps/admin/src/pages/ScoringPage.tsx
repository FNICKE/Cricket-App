import type { Dispatch, SetStateAction } from 'react';
import { Activity, ArrowRightLeft, Award, Clock, Flame, RotateCcw, X, Zap } from 'lucide-react';
import type { BattingScore, BowlingFigure, CommentaryItem, InningsState } from '../types';

type ExtraType = 'wd' | 'nb' | 'b' | 'lb';
type ScoreBallInput = {
  runsBat: number;
  extraType?: string | null;
  extraRuns?: number;
  isFour?: boolean;
  isSix?: boolean;
  isWicket?: boolean;
  dismissalType?: string;
  commentary?: string;
};

interface ScoringPageProps {
  currentInnings?: InningsState;
  striker?: BattingScore;
  nonStriker?: BattingScore;
  bowler?: BowlingFigure;
  commentary: CommentaryItem[];
  commentaryInput: string;
  setCommentaryInput: (value: string) => void;
  isSubmitting: boolean;
  scoreBall: (ball: ScoreBallInput) => void | Promise<void>;
  undoBall: () => void | Promise<void>;
  swapStrike: () => void | Promise<void>;
  changeBowler: (bowlerId: number) => void | Promise<void>;
  showWicketModal: boolean;
  setShowWicketModal: Dispatch<SetStateAction<boolean>>;
  dismissalType: string;
  setDismissalType: (value: string) => void;
  outPlayerType: 'striker' | 'nonStriker';
  setOutPlayerType: Dispatch<SetStateAction<'striker' | 'nonStriker'>>;
  fielderName: string;
  setFielderName: (value: string) => void;
  showExtraModal: boolean;
  setShowExtraModal: Dispatch<SetStateAction<boolean>>;
  selectedExtraType: ExtraType;
  setSelectedExtraType: Dispatch<SetStateAction<ExtraType>>;
  extraRuns: number;
  setExtraRuns: (value: number) => void;
  showBowlerModal: boolean;
  setShowBowlerModal: Dispatch<SetStateAction<boolean>>;
  nextBowlerId: number;
  setNextBowlerId: (value: number) => void;
}

export default function ScoringPage(props: ScoringPageProps) {
  const {
    currentInnings, striker, nonStriker, bowler, commentary, commentaryInput, setCommentaryInput,
    isSubmitting, scoreBall, undoBall, swapStrike, changeBowler, showWicketModal, setShowWicketModal,
    dismissalType, setDismissalType, outPlayerType, setOutPlayerType, fielderName, setFielderName,
    showExtraModal, setShowExtraModal, selectedExtraType, setSelectedExtraType, extraRuns, setExtraRuns,
    showBowlerModal, setShowBowlerModal, nextBowlerId, setNextBowlerId
  } = props;

  return (
    <>
        <main style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 2.5vw, 1.75rem) clamp(0.75rem, 3.5vw, 2rem)' }}>

        {/* 1. TASKVERSE STAT CARDS (CRR, RRR, Target, Overs) */}
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
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>Chase Equation</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6' }}>
              <Award size={20} />
            </div>
          </div>

          {/* Live Score */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>
                {currentInnings?.battingTeamShort || 'AUS'} Current Total
              </p>
              <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#10b981', margin: 0, lineHeight: 1 }}>
                {currentInnings?.runs ?? 145}/{currentInnings?.wickets ?? 3}
              </p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>
                Over {currentInnings?.oversDisplay ?? '16.2'} / 20.0
              </p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <Zap size={20} />
            </div>
          </div>

          {/* RRR */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Required Rate (RRR)</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#f59e0b', margin: 0, lineHeight: 1 }}>{currentInnings?.rrr ?? '11.45'}</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>Need 42 off 22 balls</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#f59e0b' }}>
              <Flame size={20} />
            </div>
          </div>

          {/* CRR */}
          <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Current Rate (CRR)</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1 }}>{currentInnings?.crr ?? '8.88'}</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>Run rate per over</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#f8fafc', color: '#64748b' }}>
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* 2. CREASE & BOWLER CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Batsmen Crease */}
          <div className="tv-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} className="text-emerald-500" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>At The Crease</h3>
              </div>
              <button
                onClick={swapStrike}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ArrowRightLeft size={12} />
                <span>Swap Strike (S)</span>
              </button>
            </div>

            {/* Striker */}
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🏏 {striker?.playerName || 'Glenn Maxwell'}
                  <span style={{ fontSize: '0.5625rem', backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>On Strike</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '2px' }}>
                  4s: {striker?.fours ?? 3} &bull; 6s: {striker?.sixes ?? 2} &bull; SR: {striker?.strikeRate ?? 188.89}
                </div>
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 900, color: '#065f46' }}>
                {striker?.runs ?? 34} <span style={{ fontSize: '0.875rem', color: '#6ee7b7', fontWeight: 500 }}>({striker?.balls ?? 18})</span>
              </div>
            </div>

            {/* Non-Striker */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0f172a' }}>
                  {nonStriker?.playerName || 'Marcus Stoinis'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  4s: {nonStriker?.fours ?? 1} &bull; 6s: {nonStriker?.sixes ?? 1} &bull; SR: {nonStriker?.strikeRate ?? 150.00}
                </div>
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 900, color: '#0f172a' }}>
                {nonStriker?.runs ?? 18} <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500 }}>({nonStriker?.balls ?? 12})</span>
              </div>
            </div>
          </div>

          {/* Current Bowler */}
          <div className="tv-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} className="text-amber-500" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Current Bowler</h3>
              </div>
              <button
                onClick={() => setShowBowlerModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>Change Bowler</span>
              </button>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0f172a' }}>
                  ⚡ {bowler?.playerName || 'Jasprit Bumrah'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Econ: {bowler?.economy ?? 6.60} &bull; Overs: {bowler?.oversDisplay ?? '3.2'}</div>
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 900, color: '#dc2626' }}>
                {bowler?.wickets ?? 1} / {bowler?.runs ?? 22}
              </div>
            </div>

            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.75rem',
              color: '#065f46',
              fontWeight: 600
            }}>
              <strong>Partnership:</strong> {currentInnings?.currentPartnership?.totalRuns ?? 52} runs off {currentInnings?.currentPartnership?.totalBalls ?? 30} balls
            </div>
          </div>
        </div>

        {/* 3. TACTILE KEYPAD (TaskVerse Button System) */}
        <div className="tv-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tactile Scoring Keypad &bull; Keyboard Shortcuts Enabled
            </h3>
            <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 700 }}>Press 0–6, W, D, N, S, U</span>
          </div>

          {/* Number runs (0, 1, 2, 3, 4, 6) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '14px' }}>
            {[
              { runs: 0, label: '0 Dot', key: '0', bg: '#f8fafc', color: '#334155', border: '#e2e8f0' },
              { runs: 1, label: '1 Single', key: '1', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
              { runs: 2, label: '2 Double', key: '2', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
              { runs: 3, label: '3 Three', key: '3', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
              { runs: 4, label: '4 FOUR', key: '4', bg: '#10b981', color: '#ffffff', border: '#10b981', four: true },
              { runs: 6, label: '6 SIX', key: '6', bg: '#8b5cf6', color: '#ffffff', border: '#8b5cf6', six: true }
            ].map((btn) => (
              <button
                key={btn.runs}
                onClick={() => scoreBall({ runsBat: btn.runs, isFour: btn.four, isSix: btn.six })}
                disabled={isSubmitting}
                className="keypad-btn"
                style={{
                  backgroundColor: btn.bg,
                  color: btn.color,
                  border: `1.5px solid ${btn.border}`,
                  borderRadius: '12px',
                  padding: '16px 8px',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: btn.four || btn.six ? '0 4px 10px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.02)'
                }}
              >
                <span>{btn.runs}</span>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, opacity: 0.85 }}>[{btn.key}]</span>
              </button>
            ))}
          </div>

          {/* Extras & Action Events */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 2fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={() => { setSelectedExtraType('wd'); setShowExtraModal(true); }}
              className="keypad-btn"
              style={{ backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
            >
              WIDE (D)
            </button>
            <button
              onClick={() => { setSelectedExtraType('nb'); setShowExtraModal(true); }}
              className="keypad-btn"
              style={{ backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', borderRadius: '10px', padding: '12px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
            >
              NO BALL (N)
            </button>
            <button
              onClick={() => { setSelectedExtraType('b'); setShowExtraModal(true); }}
              className="keypad-btn"
              style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
            >
              BYE (B)
            </button>
            <button
              onClick={() => { setSelectedExtraType('lb'); setShowExtraModal(true); }}
              className="keypad-btn"
              style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
            >
              LEG BYE (L)
            </button>

            {/* WICKET BUTTON */}
            <button
              onClick={() => setShowWicketModal(true)}
              className="keypad-btn"
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontWeight: 900,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 8px rgba(239, 68, 68, 0.25)'
              }}
            >
              🔴 WICKET (W)
            </button>

            {/* UNDO BUTTON */}
            <button
              onClick={undoBall}
              disabled={isSubmitting}
              className="keypad-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '12px',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              <span>UNDO</span>
            </button>
          </div>

          {/* Commentary Bar */}
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              Commentary Note (Optional custom text before saving delivery):
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={commentaryInput}
                onChange={(e) => setCommentaryInput(e.target.value)}
                placeholder="e.g. Jasprit Bumrah to Glenn Maxwell, 1 run, slower ball angled into the pads..."
                style={{
                  flex: 1,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#0f172a',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* 4. RECENT COMMENTARY FEED (TaskVerse Clean Cards) */}
        <div className="tv-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Live Commentary Feed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }} className="scrollbar-thin">
            {commentary.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: item.isWicket ? '#fef2f2' : item.isBoundary ? '#f0fdf4' : '#f8fafc',
                  borderLeft: `3px solid ${item.isWicket ? '#ef4444' : item.isBoundary ? '#10b981' : '#cbd5e1'}`,
                  borderRadius: '8px',
                  padding: '10px 14px'
                }}
              >
                {item.headline && (
                  <div style={{ fontWeight: 800, fontSize: '0.75rem', color: item.isWicket ? '#dc2626' : item.isBoundary ? '#15803d' : '#0f172a' }}>
                    {item.headline}
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* WICKET MODAL */}
      {showWicketModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#dc2626', margin: 0 }}>
                🔴 Record Wicket Dismissal
              </h2>
              <button onClick={() => setShowWicketModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Dismissal Type</label>
              <select
                value={dismissalType}
                onChange={(e) => setDismissalType(e.target.value)}
                style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', padding: '10px', borderRadius: '8px', fontSize: '0.8125rem' }}
              >
                <option value="caught">Caught</option>
                <option value="bowled">Bowled</option>
                <option value="lbw">LBW</option>
                <option value="run_out">Run Out</option>
                <option value="stumped">Stumped</option>
                <option value="caught_and_bowled">Caught & Bowled</option>
                <option value="hit_wicket">Hit Wicket</option>
                <option value="retired_hurt">Retired Hurt</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Batter Out</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setOutPlayerType('striker')}
                  style={{
                    flex: 1,
                    backgroundColor: outPlayerType === 'striker' ? '#10b981' : '#f8fafc',
                    color: outPlayerType === 'striker' ? '#ffffff' : '#0f172a',
                    border: `1px solid ${outPlayerType === 'striker' ? '#10b981' : '#e2e8f0'}`,
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Striker ({striker?.playerName})
                </button>
                <button
                  type="button"
                  onClick={() => setOutPlayerType('nonStriker')}
                  style={{
                    flex: 1,
                    backgroundColor: outPlayerType === 'nonStriker' ? '#10b981' : '#f8fafc',
                    color: outPlayerType === 'nonStriker' ? '#ffffff' : '#0f172a',
                    border: `1px solid ${outPlayerType === 'nonStriker' ? '#10b981' : '#e2e8f0'}`,
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Non-Striker ({nonStriker?.playerName})
                </button>
              </div>
            </div>

            {dismissalType === 'caught' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Fielder Name</label>
                <input
                  type="text"
                  value={fielderName}
                  onChange={(e) => setFielderName(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', padding: '10px', borderRadius: '8px', fontSize: '0.8125rem' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
              <button
                onClick={() => setShowWicketModal(false)}
                style={{ backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  scoreBall({
                    runsBat: 0,
                    isWicket: true,
                    dismissalType,
                    commentary: `${bowler?.playerName} to ${striker?.playerName}, OUT! ${dismissalType}! Huge wicket for India!`
                  });
                  setShowWicketModal(false);
                }}
                style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.25)' }}
              >
                Confirm Wicket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXTRAS MODAL */}
      {showExtraModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#f59e0b', margin: 0 }}>
                Record Extra: {selectedExtraType.toUpperCase()}
              </h2>
              <button onClick={() => setShowExtraModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Additional Runs Run / Boundary:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2, 4].map((r) => (
                  <button
                    key={r}
                    onClick={() => setExtraRuns(r)}
                    style={{
                      flex: 1,
                      backgroundColor: extraRuns === r ? '#10b981' : '#f8fafc',
                      color: extraRuns === r ? '#ffffff' : '#0f172a',
                      border: `1px solid ${extraRuns === r ? '#10b981' : '#e2e8f0'}`,
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    +{r}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowExtraModal(false)}
                style={{ backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  scoreBall({
                    runsBat: 0,
                    extraType: selectedExtraType,
                    extraRuns,
                    commentary: `${bowler?.playerName} to ${striker?.playerName}, ${selectedExtraType.toUpperCase()}${extraRuns > 0 ? ` + ${extraRuns} runs` : ''}`
                  });
                  setShowExtraModal(false);
                }}
                style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)' }}
              >
                Save Extra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOWLER CHANGE MODAL */}
      {showBowlerModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Select Next Bowler
              </h2>
              <button onClick={() => setShowBowlerModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                { id: 7, name: 'Jasprit Bumrah', figures: '3.2-0-22-1' },
                { id: 8, name: 'Arshdeep Singh', figures: '4.0-0-34-1' },
                { id: 9, name: 'Kuldeep Yadav', figures: '4.0-0-38-1' },
                { id: 11, name: 'Mohammed Siraj', figures: '3.0-0-35-0' },
                { id: 5, name: 'Hardik Pandya', figures: '2.0-0-14-0' }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setNextBowlerId(b.id)}
                  style={{
                    backgroundColor: nextBowlerId === b.id ? '#ecfdf5' : '#f8fafc',
                    color: nextBowlerId === b.id ? '#065f46' : '#0f172a',
                    border: `1px solid ${nextBowlerId === b.id ? '#a7f3d0' : '#e2e8f0'}`,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>{b.name}</span>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{b.figures}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowBowlerModal(false)}
                style={{ backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => changeBowler(nextBowlerId)}
                style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)' }}
              >
                Assign Bowler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
