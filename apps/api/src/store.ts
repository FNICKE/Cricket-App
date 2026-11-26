// =====================================================================
// IN-MEMORY HIGH-SPEED LIVE MATCH STORE
// Single-source-of-truth state for real-time scoring & public API
// =====================================================================

import type {
  MatchLiveState,
  BallRecord,
  BallInput,
  CommentaryItem,
  Team,
  Player,
  InningsState,
  PlayerRegistration,
  PlayerRegistrationInput
} from '../../../packages/shared/src/types.ts';
import { recomputeInningsFromBalls } from '../../../packages/shared/src/scoringEngine.ts';
import { formatBallBadge } from '../../../packages/shared/src/formatters.ts';

export const TEAMS: Record<number, Team> = {
  1: {
    id: 1,
    name: 'India',
    shortName: 'IND',
    logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop',
    primaryColor: '#0055A5',
    teamType: 'international',
    country: 'India'
  },
  2: {
    id: 2,
    name: 'Australia',
    shortName: 'AUS',
    logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop',
    primaryColor: '#FFD100',
    teamType: 'international',
    country: 'Australia'
  },
  3: {
    id: 3,
    name: 'England',
    shortName: 'ENG',
    logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop',
    primaryColor: '#0B1A30',
    teamType: 'international',
    country: 'England'
  },
  4: {
    id: 4,
    name: 'South Africa',
    shortName: 'SA',
    logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop',
    primaryColor: '#007A3D',
    teamType: 'international',
    country: 'South Africa'
  }
};

export const PLAYERS: Record<number, Player> = {
  // India
  1: { id: 1, fullName: 'Rohit Sharma', shortName: 'R Sharma', country: 'India', role: 'batsman' },
  2: { id: 2, fullName: 'Virat Kohli', shortName: 'V Kohli', country: 'India', role: 'batsman' },
  3: { id: 3, fullName: 'Suryakumar Yadav', shortName: 'SA Yadav', country: 'India', role: 'batsman' },
  4: { id: 4, fullName: 'Rishabh Pant', shortName: 'R Pant', country: 'India', role: 'wicket_keeper' },
  5: { id: 5, fullName: 'Hardik Pandya', shortName: 'H Pandya', country: 'India', role: 'all_rounder' },
  6: { id: 6, fullName: 'Ravindra Jadeja', shortName: 'R Jadeja', country: 'India', role: 'all_rounder' },
  7: { id: 7, fullName: 'Jasprit Bumrah', shortName: 'J Bumrah', country: 'India', role: 'bowler' },
  8: { id: 8, fullName: 'Arshdeep Singh', shortName: 'A Singh', country: 'India', role: 'bowler' },
  9: { id: 9, fullName: 'Kuldeep Yadav', shortName: 'K Yadav', country: 'India', role: 'bowler' },
  10: { id: 10, fullName: 'Shubman Gill', shortName: 'S Gill', country: 'India', role: 'batsman' },
  11: { id: 11, fullName: 'Mohammed Siraj', shortName: 'M Siraj', country: 'India', role: 'bowler' },

  // Australia
  21: { id: 21, fullName: 'Travis Head', shortName: 'T Head', country: 'Australia', role: 'batsman' },
  22: { id: 22, fullName: 'David Warner', shortName: 'D Warner', country: 'Australia', role: 'batsman' },
  23: { id: 23, fullName: 'Mitchell Marsh', shortName: 'M Marsh', country: 'Australia', role: 'all_rounder' },
  24: { id: 24, fullName: 'Glenn Maxwell', shortName: 'G Maxwell', country: 'Australia', role: 'all_rounder' },
  25: { id: 25, fullName: 'Marcus Stoinis', shortName: 'M Stoinis', country: 'Australia', role: 'all_rounder' },
  26: { id: 26, fullName: 'Josh Inglis', shortName: 'J Inglis', country: 'Australia', role: 'wicket_keeper' },
  27: { id: 27, fullName: 'Pat Cummins', shortName: 'P Cummins', country: 'Australia', role: 'bowler' },
  28: { id: 28, fullName: 'Mitchell Starc', shortName: 'M Starc', country: 'Australia', role: 'bowler' },
  29: { id: 29, fullName: 'Adam Zampa', shortName: 'A Zampa', country: 'Australia', role: 'bowler' },
  30: { id: 30, fullName: 'Josh Hazlewood', shortName: 'J Hazlewood', country: 'Australia', role: 'bowler' },
  31: { id: 31, fullName: 'Steven Smith', shortName: 'S Smith', country: 'Australia', role: 'batsman' }
};

export const SQUADS: Record<number, { teamA: number[]; teamB: number[] }> = {
  1: {
    teamA: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    teamB: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  }
};

// Seed initial ball log for Innings 2 (Australia chase of 187)
let ballsInnings2: BallRecord[] = [
  // Over 15
  { id: 91, inningsId: 2, seq: 91, overNo: 14, ballInOver: 1, bowlerId: 9, strikerId: 25, nonStrikerId: 24, runsBat: 1, isLegal: true, createdAt: '2026-11-23T16:30:00Z', commentary: 'Kuldeep to Stoinis, 1 run, pushed to long-off' },
  { id: 92, inningsId: 2, seq: 92, overNo: 14, ballInOver: 2, bowlerId: 9, strikerId: 24, nonStrikerId: 25, runsBat: 4, isLegal: true, isFour: true, createdAt: '2026-11-23T16:30:30Z', commentary: 'Kuldeep to Maxwell, FOUR! Reverse sweep past backward point!' },
  { id: 93, inningsId: 2, seq: 93, overNo: 14, ballInOver: 3, bowlerId: 9, strikerId: 24, nonStrikerId: 25, runsBat: 0, isLegal: true, createdAt: '2026-11-23T16:31:00Z', commentary: 'Kuldeep to Maxwell, no run, defended back' },
  { id: 94, inningsId: 2, seq: 94, overNo: 14, ballInOver: 4, bowlerId: 9, strikerId: 24, nonStrikerId: 25, runsBat: 6, isLegal: true, isSix: true, createdAt: '2026-11-23T16:31:30Z', commentary: 'Kuldeep to Maxwell, SIX! Smoked into the second tier!' },
  { id: 95, inningsId: 2, seq: 95, overNo: 14, ballInOver: 5, bowlerId: 9, strikerId: 24, nonStrikerId: 25, runsBat: 1, isLegal: true, createdAt: '2026-11-23T16:32:00Z', commentary: 'Kuldeep to Maxwell, 1 run to square leg' },
  { id: 96, inningsId: 2, seq: 96, overNo: 14, ballInOver: 6, bowlerId: 9, strikerId: 25, nonStrikerId: 24, runsBat: 2, isLegal: true, createdAt: '2026-11-23T16:32:30Z', commentary: 'Kuldeep to Stoinis, 2 runs through deep cover' },
  // Over 16
  { id: 97, inningsId: 2, seq: 97, overNo: 15, ballInOver: 1, bowlerId: 7, strikerId: 24, nonStrikerId: 25, runsBat: 0, isLegal: true, createdAt: '2026-11-23T16:33:00Z', commentary: 'Bumrah to Maxwell, no run, toe-crushing yorker at 144 kph' },
  { id: 98, inningsId: 2, seq: 98, overNo: 15, ballInOver: 2, bowlerId: 7, strikerId: 24, nonStrikerId: 25, runsBat: 1, isLegal: true, createdAt: '2026-11-23T16:33:30Z', commentary: 'Bumrah to Maxwell, 1 run off hip to mid-wicket' }
];

let commentaryList: CommentaryItem[] = [
  { id: 105, matchId: 1, inningsId: 2, overNo: 16, ballNo: 2, type: 'ball', headline: 'Single', text: 'Bumrah to Maxwell, 1 run, slower ball angled into the pads, turned to mid-wicket for a quick single.', runs: 1, isBoundary: false, createdAt: '2026-11-23T16:33:30Z' },
  { id: 104, matchId: 1, inningsId: 2, overNo: 16, ballNo: 1, type: 'ball', headline: 'Dot ball', text: 'Jasprit Bumrah to Maxwell, no run, toe-crushing yorker at 144 kph, dug out brilliantly!', runs: 0, isBoundary: false, createdAt: '2026-11-23T16:33:00Z' },
  { id: 103, matchId: 1, inningsId: 2, overNo: 15, ballNo: 6, type: 'over_summary', headline: 'End of Over 15', text: '14 runs from the over. Australia 144/3. Maxwell 33*, Stoinis 18*. Required rate is 10.8 RPO.', runs: 14, isBoundary: false, createdAt: '2026-11-23T16:32:30Z' },
  { id: 102, matchId: 1, inningsId: 2, overNo: 15, ballNo: 4, type: 'ball', headline: 'SIX RUNS!', text: 'Kuldeep Yadav to Maxwell, SIX! Smoked high and handsome over deep mid-wicket into the second tier!', runs: 6, isBoundary: true, createdAt: '2026-11-23T16:31:30Z' },
  { id: 101, matchId: 1, inningsId: 2, overNo: 15, ballNo: 2, type: 'ball', headline: 'FOUR!', text: 'Kuldeep Yadav to Maxwell, FOUR! Reverse sweep carved beautifully past backward point!', runs: 4, isBoundary: true, createdAt: '2026-11-23T16:30:30Z' }
];

// Innings 1 (India 186/5 - Completed)
const innings1: InningsState = {
  id: 1,
  matchId: 1,
  inningsNo: 1,
  battingTeamId: 1,
  bowlingTeamId: 2,
  battingTeamName: 'India',
  bowlingTeamName: 'Australia',
  battingTeamShort: 'IND',
  bowlingTeamShort: 'AUS',
  runs: 186,
  wickets: 5,
  legalBalls: 120,
  oversDisplay: '20.0',
  crr: 9.30,
  status: 'completed',
  battingScores: [
    { playerId: 1, playerName: 'Rohit Sharma', battingOrder: 1, runs: 48, balls: 28, dotBalls: 8, fours: 5, sixes: 3, strikeRate: 171.43, dismissalText: 'c Head b Starc', isOut: true, isOnStrike: false, isBatting: false },
    { playerId: 2, playerName: 'Virat Kohli', battingOrder: 2, runs: 62, balls: 44, dotBalls: 12, fours: 6, sixes: 2, strikeRate: 140.91, dismissalText: 'c †Inglis b Cummins', isOut: true, isOnStrike: false, isBatting: false },
    { playerId: 3, playerName: 'Suryakumar Yadav', battingOrder: 3, runs: 35, balls: 18, dotBalls: 4, fours: 3, sixes: 3, strikeRate: 194.44, dismissalText: 'b Zampa', isOut: true, isOnStrike: false, isBatting: false },
    { playerId: 4, playerName: 'Rishabh Pant', battingOrder: 4, runs: 12, balls: 9, dotBalls: 3, fours: 1, sixes: 0, strikeRate: 133.33, dismissalText: 'run out (Maxwell)', isOut: true, isOnStrike: false, isBatting: false },
    { playerId: 5, playerName: 'Hardik Pandya', battingOrder: 5, runs: 21, balls: 14, dotBalls: 3, fours: 2, sixes: 1, strikeRate: 150.00, dismissalText: 'not out', isOut: false, isOnStrike: true, isBatting: true },
    { playerId: 6, playerName: 'Ravindra Jadeja', battingOrder: 6, runs: 4, balls: 7, dotBalls: 3, fours: 0, sixes: 0, strikeRate: 57.14, dismissalText: 'c Stoinis b Hazlewood', isOut: true, isOnStrike: false, isBatting: false }
  ],
  bowlingFigures: [
    { playerId: 28, playerName: 'Mitchell Starc', bowlingOrder: 1, legalBalls: 24, oversDisplay: '4.0', maidens: 0, runs: 42, wickets: 1, wides: 2, noBalls: 1, dotBalls: 8, economy: 10.50, isBowling: false },
    { playerId: 30, playerName: 'Josh Hazlewood', bowlingOrder: 2, legalBalls: 24, oversDisplay: '4.0', maidens: 0, runs: 31, wickets: 1, wides: 1, noBalls: 0, dotBalls: 11, economy: 7.75, isBowling: false },
    { playerId: 27, playerName: 'Pat Cummins', bowlingOrder: 3, legalBalls: 24, oversDisplay: '4.0', maidens: 0, runs: 38, wickets: 1, wides: 1, noBalls: 1, dotBalls: 9, economy: 9.50, isBowling: false },
    { playerId: 29, playerName: 'Adam Zampa', bowlingOrder: 4, legalBalls: 24, oversDisplay: '4.0', maidens: 0, runs: 39, wickets: 1, wides: 2, noBalls: 0, dotBalls: 7, economy: 9.75, isBowling: false },
    { playerId: 25, playerName: 'Marcus Stoinis', bowlingOrder: 5, legalBalls: 24, oversDisplay: '4.0', maidens: 0, runs: 32, wickets: 0, wides: 0, noBalls: 0, dotBalls: 8, economy: 8.00, isBowling: false }
  ],
  fallOfWickets: [
    { wicketNo: 1, playerId: 1, playerName: 'Rohit Sharma', score: 74, overDisplay: '7.2', legalBalls: 44 },
    { wicketNo: 2, playerId: 3, playerName: 'Suryakumar Yadav', score: 128, overDisplay: '13.4', legalBalls: 82 },
    { wicketNo: 3, playerId: 4, playerName: 'Rishabh Pant', score: 145, overDisplay: '15.3', legalBalls: 93 },
    { wicketNo: 4, playerId: 2, playerName: 'Virat Kohli', score: 168, overDisplay: '18.1', legalBalls: 109 },
    { wicketNo: 5, playerId: 6, playerName: 'Ravindra Jadeja', score: 186, overDisplay: '20.0', legalBalls: 120 }
  ],
  recentBalls: ['1', '4', '6', 'W', '2', '1']
};

let matchVersion = 1;

let liveMatchState: MatchLiveState = {
  matchId: 1,
  seriesName: "ICC Men's T20 World Cup 2026",
  matchNo: 'Match 28 - Super 8',
  format: 'T20',
  venueName: 'Wankhede Stadium',
  venueCity: 'Mumbai',
  teamA: TEAMS[1],
  teamB: TEAMS[2],
  tossWinner: 'Australia',
  tossDecision: 'bowl',
  status: 'live',
  statusNote: 'Australia need 42 runs in 22 balls',
  currentInningsNo: 2,
  innings: [innings1],
  version: matchVersion
};

// Helper: refresh live innings 2 state from balls
function computeLiveInnings2(): InningsState {
  const ausSquad = SQUADS[1].teamB.map((id) => ({ id, name: PLAYERS[id]?.fullName || '' }));
  const indSquad = SQUADS[1].teamA.map((id) => ({ id, name: PLAYERS[id]?.fullName || '' }));

  const computed = recomputeInningsFromBalls({
    matchId: 1,
    inningsNo: 2,
    maxOvers: 20,
    target: 187,
    balls: ballsInnings2,
    allBatters: ausSquad,
    allBowlers: indSquad,
    initialStrikerId: 24, // Maxwell
    initialNonStrikerId: 25, // Stoinis
    initialBowlerId: 7 // Bumrah
  });

  // Base previous runs & wickets from earlier in innings (Head 45, Warner 18, Marsh 24)
  const baseRuns = 131; // runs before our tracked balls
  const baseLegalBalls = 90; // 15 overs = 90 balls
  const totalRuns = baseRuns + computed.runs;
  const totalLegalBalls = baseLegalBalls + computed.legalBalls;
  const totalWickets = 3 + computed.wickets;

  const ballsLeft = Math.max(0, 120 - totalLegalBalls);
  const needed = Math.max(0, 187 - totalRuns);

  return {
    id: 2,
    matchId: 1,
    inningsNo: 2,
    battingTeamId: 2,
    bowlingTeamId: 1,
    battingTeamName: 'Australia',
    bowlingTeamName: 'India',
    battingTeamShort: 'AUS',
    bowlingTeamShort: 'IND',
    runs: totalRuns,
    wickets: totalWickets,
    legalBalls: totalLegalBalls,
    oversDisplay: `${Math.floor(totalLegalBalls / 6)}.${totalLegalBalls % 6}`,
    crr: Number((totalRuns / (totalLegalBalls / 6)).toFixed(2)),
    rrr: ballsLeft > 0 ? Number((needed / (ballsLeft / 6)).toFixed(2)) : 0,
    target: 187,
    neededRuns: needed,
    ballsRemaining: ballsLeft,
    status: computed.isInningsEnded ? 'completed' : 'live',
    battingScores: [
      { playerId: 21, playerName: 'Travis Head', battingOrder: 1, runs: 45, balls: 26, dotBalls: 7, fours: 5, sixes: 2, strikeRate: 173.08, dismissalText: 'c †Pant b Bumrah', isOut: true, isOnStrike: false, isBatting: false },
      { playerId: 22, playerName: 'David Warner', battingOrder: 2, runs: 18, balls: 15, dotBalls: 6, fours: 2, sixes: 0, strikeRate: 120.00, dismissalText: 'b Arshdeep', isOut: true, isOnStrike: false, isBatting: false },
      { playerId: 23, playerName: 'Mitchell Marsh', battingOrder: 3, runs: 24, balls: 21, dotBalls: 8, fours: 2, sixes: 1, strikeRate: 114.29, dismissalText: 'lbw b Kuldeep', isOut: true, isOnStrike: false, isBatting: false },
      { playerId: 24, playerName: 'Glenn Maxwell', battingOrder: 4, runs: 22 + (computed.battingScores.find(b => b.playerId === 24)?.runs || 0), balls: 11 + (computed.battingScores.find(b => b.playerId === 24)?.balls || 0), dotBalls: 4, fours: 3, sixes: 2, strikeRate: 188.89, isOut: false, isOnStrike: computed.strikerId === 24, isBatting: true },
      { playerId: 25, playerName: 'Marcus Stoinis', battingOrder: 5, runs: 15 + (computed.battingScores.find(b => b.playerId === 25)?.runs || 0), balls: 10 + (computed.battingScores.find(b => b.playerId === 25)?.balls || 0), dotBalls: 3, fours: 1, sixes: 1, strikeRate: 150.00, isOut: false, isOnStrike: computed.strikerId === 25, isBatting: true }
    ],
    bowlingFigures: [
      { playerId: 8, playerName: 'Arshdeep Singh', bowlingOrder: 1, legalBalls: 24, oversDisplay: '4.0', maidens: 0, runs: 34, wickets: 1, wides: 1, noBalls: 0, dotBalls: 10, economy: 8.50, isBowling: false },
      { playerId: 7, playerName: 'Jasprit Bumrah', bowlingOrder: 2, legalBalls: 18 + (computed.bowlingFigures.find(b => b.playerId === 7)?.legalBalls || 0), oversDisplay: `${Math.floor((18 + (computed.bowlingFigures.find(b => b.playerId === 7)?.legalBalls || 0)) / 6)}.${(18 + (computed.bowlingFigures.find(b => b.playerId === 7)?.legalBalls || 0)) % 6}`, maidens: 0, runs: 21 + (computed.bowlingFigures.find(b => b.playerId === 7)?.runs || 0), wickets: 1, wides: 1, noBalls: 0, dotBalls: 12, economy: 6.60, isBowling: true },
      { playerId: 11, playerName: 'Mohammed Siraj', bowlingOrder: 3, legalBalls: 18, oversDisplay: '3.0', maidens: 0, runs: 35, wickets: 0, wides: 1, noBalls: 1, dotBalls: 5, economy: 11.67, isBowling: false },
      { playerId: 9, playerName: 'Kuldeep Yadav', bowlingOrder: 4, legalBalls: 24, oversDisplay: '4.0', maidens: 0, runs: 38, wickets: 1, wides: 1, noBalls: 0, dotBalls: 8, economy: 9.50, isBowling: false },
      { playerId: 5, playerName: 'Hardik Pandya', bowlingOrder: 5, legalBalls: 12, oversDisplay: '2.0', maidens: 0, runs: 14, wickets: 0, wides: 0, noBalls: 0, dotBalls: 4, economy: 7.00, isBowling: false }
    ],
    currentPartnership: {
      wicketNo: 4,
      player1Id: computed.strikerId || 24,
      player1Name: PLAYERS[computed.strikerId || 24]?.fullName || 'Maxwell',
      player1Runs: 34,
      player1Balls: 18,
      player2Id: computed.nonStrikerId || 25,
      player2Name: PLAYERS[computed.nonStrikerId || 25]?.fullName || 'Stoinis',
      player2Runs: 18,
      player2Balls: 12,
      totalRuns: 52 + computed.runs,
      totalBalls: 30 + computed.legalBalls,
      isActive: true
    },
    fallOfWickets: [
      { wicketNo: 1, playerId: 22, playerName: 'David Warner', score: 32, overDisplay: '3.4', legalBalls: 22 },
      { wicketNo: 2, playerId: 21, playerName: 'Travis Head', score: 68, overDisplay: '7.1', legalBalls: 43 },
      { wicketNo: 3, playerId: 23, playerName: 'Mitchell Marsh', score: 93, overDisplay: '11.2', legalBalls: 68 }
    ],
    recentBalls: computed.recentBalls.length > 0 ? computed.recentBalls : ['1', '4', '0', '6', '1', '2', '|', '0', '1'],
    strikerId: computed.strikerId || 24,
    nonStrikerId: computed.nonStrikerId || 25,
    currentBowlerId: computed.currentBowlerId || 7
  };
}

// Update live match snapshot
export function refreshMatchSnapshot(): MatchLiveState {
  const currentInnings = computeLiveInnings2();
  matchVersion += 1;

  let note = `Australia need ${currentInnings.neededRuns} runs in ${currentInnings.ballsRemaining} balls`;
  let resultText: string | undefined;

  if (currentInnings.runs >= 187) {
    liveMatchState.status = 'completed';
    resultText = `Australia won by ${10 - currentInnings.wickets} wickets (${currentInnings.ballsRemaining} balls left)`;
    note = resultText;
  } else if (currentInnings.ballsRemaining === 0 || currentInnings.wickets >= 10) {
    liveMatchState.status = 'completed';
    resultText = `India won by ${187 - 1 - currentInnings.runs} runs`;
    note = resultText;
  }

  liveMatchState = {
    ...liveMatchState,
    statusNote: note,
    resultText,
    innings: [innings1, currentInnings],
    currentInnings,
    version: matchVersion
  };

  return liveMatchState;
}

// Initial compile
refreshMatchSnapshot();

// =====================================================================
// STORE ACCESSORS & MUTATORS
// =====================================================================

export function getHomeData() {
  const liveState = refreshMatchSnapshot();
  return {
    scoreStrip: [
      {
        matchId: 1,
        series: "ICC Men's T20 World Cup 2026",
        matchNo: 'Match 28 - Super 8',
        status: liveState.status,
        statusNote: liveState.statusNote,
        teamA: { shortName: 'IND', score: '186/5 (20.0)' },
        teamB: {
          shortName: 'AUS',
          score: `${liveState.currentInnings?.runs}/${liveState.currentInnings?.wickets} (${liveState.currentInnings?.oversDisplay})`
        }
      },
      {
        matchId: 2,
        series: "ICC Men's T20 World Cup 2026",
        matchNo: 'Match 27 - Super 8',
        status: 'completed',
        statusNote: 'South Africa won by 14 runs',
        teamA: { shortName: 'SA', score: '178/6 (20.0)' },
        teamB: { shortName: 'ENG', score: '164/8 (20.0)' }
      },
      {
        matchId: 3,
        series: 'Indian Premier League 2026',
        matchNo: 'Match 1',
        status: 'upcoming',
        statusNote: 'Starts tomorrow at 19:30 IST',
        teamA: { shortName: 'CSK', score: 'Upcoming' },
        teamB: { shortName: 'MI', score: 'Upcoming' }
      }
    ],
    topStories: [
      {
        id: 1,
        title: 'India vs Australia Super 8 Thriller: Maxwell and Stoinis Keep Aussies in the Hunt',
        slug: 'ind-vs-aus-super-8-thriller-maxwell-stoinis',
        excerpt: 'Australia require 42 runs from the final 22 deliveries with Glenn Maxwell leading the charge against Jasprit Bumrah at Wankhede.',
        heroImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
        publishedAt: '10 mins ago'
      },
      {
        id: 2,
        title: 'Bumrah Yorker Precision: How The Spearhead Dismantled Top Orders Throughout T20WC 2026',
        slug: 'bumrah-yorker-precision-t20wc-2026',
        excerpt: 'Deep-dive tactical analysis of Jasprit Bumrah unmatched death-bowling wizardry in the T20 World Cup.',
        heroImage: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=800&auto=format&fit=crop',
        publishedAt: '1 hour ago'
      }
    ]
  };
}

export function getMatchLive(matchId: number) {
  return refreshMatchSnapshot();
}

export function getMatchScorecard(matchId: number) {
  const live = refreshMatchSnapshot();
  return {
    matchId,
    innings: live.innings
  };
}

export function getMatchCommentary(matchId: number) {
  return commentaryList;
}

export function addScoredBall(matchId: number, input: BallInput): { ball: BallRecord; state: MatchLiveState } {
  const currentInnings = computeLiveInnings2();
  const nextSeq = (ballsInnings2[ballsInnings2.length - 1]?.seq || 98) + 1;
  const isLegal = input.extraType !== 'wd' && input.extraType !== 'nb';
  
  const currentOverNo = Math.floor(currentInnings.legalBalls / 6);
  const currentBallInOver = (currentInnings.legalBalls % 6) + (isLegal ? 1 : 0);

  const strikerId = input.strikerId || currentInnings.strikerId || 24;
  const nonStrikerId = input.nonStrikerId || currentInnings.nonStrikerId || 25;
  const bowlerId = input.bowlerId || currentInnings.currentBowlerId || 7;

  // Auto-generate Cricbuzz style commentary if not supplied
  const strikerName = PLAYERS[strikerId]?.shortName || 'Batter';
  const bowlerName = PLAYERS[bowlerId]?.shortName || 'Bowler';
  let commText = input.commentary;
  if (!commText) {
    if (input.isWicket) {
      commText = `${bowlerName} to ${strikerName}, OUT! ${input.dismissalType || 'Caught'}! Huge breakthrough!`;
    } else if (input.isSix) {
      commText = `${bowlerName} to ${strikerName}, SIX RUNS! Towering strike over the fence!`;
    } else if (input.isFour) {
      commText = `${bowlerName} to ${strikerName}, FOUR! Crunched through the gap with surgical timing!`;
    } else if (input.extraType === 'wd') {
      commText = `${bowlerName} to ${strikerName}, WIDE! Wayward line down leg side.`;
    } else if (input.extraType === 'nb') {
      commText = `${bowlerName} to ${strikerName}, NO BALL! Overstepping, Free Hit upcoming!`;
    } else if (input.runsBat === 0) {
      commText = `${bowlerName} to ${strikerName}, no run. Solid defense on length.`;
    } else {
      commText = `${bowlerName} to ${strikerName}, ${input.runsBat} run(s), worked into the gap.`;
    }
  }

  const newBall: BallRecord = {
    id: nextSeq,
    inningsId: 2,
    seq: nextSeq,
    overNo: currentOverNo,
    ballInOver: currentBallInOver,
    bowlerId,
    strikerId,
    nonStrikerId,
    runsBat: input.runsBat || 0,
    extraType: input.extraType || null,
    extraRuns: input.extraRuns || 0,
    isLegal,
    isFour: input.isFour || false,
    isSix: input.isSix || false,
    isWicket: input.isWicket || false,
    dismissalType: input.dismissalType,
    outPlayerId: input.outPlayerId,
    fielder1Id: input.fielder1Id,
    commentary: commText,
    createdAt: new Date().toISOString()
  };

  ballsInnings2.push(newBall);

  // Add to commentary items
  const newCommentary: CommentaryItem = {
    id: Date.now(),
    matchId,
    inningsId: 2,
    overNo: currentOverNo,
    ballNo: currentBallInOver,
    type: 'ball',
    headline: input.isWicket ? 'WICKET!' : input.isSix ? 'SIX!' : input.isFour ? 'FOUR!' : `${input.runsBat} Run(s)`,
    text: commText,
    runs: (input.runsBat || 0) + (input.extraRuns || 0),
    isWicket: input.isWicket,
    isBoundary: Boolean(input.isFour || input.isSix),
    createdAt: new Date().toISOString()
  };
  commentaryList.unshift(newCommentary);

  const updatedState = refreshMatchSnapshot();
  return { ball: newBall, state: updatedState };
}

export function undoLastScoredBall(matchId: number): MatchLiveState {
  if (ballsInnings2.length > 0) {
    ballsInnings2.pop();
    if (commentaryList.length > 0) {
      commentaryList.shift();
    }
  }
  return refreshMatchSnapshot();
}

export function swapMatchStrike(matchId: number): MatchLiveState {
  const current = computeLiveInnings2();
  const temp = current.strikerId;
  current.strikerId = current.nonStrikerId;
  current.nonStrikerId = temp;
  return refreshMatchSnapshot();
}

export function setMatchBowler(matchId: number, bowlerId: number): MatchLiveState {
  const current = computeLiveInnings2();
  current.currentBowlerId = bowlerId;
  return refreshMatchSnapshot();
}

export function getPointsTable() {
  return [
    { team: TEAMS[1], p: 2, w: 2, l: 0, nr: 0, pts: 4, nrr: '+1.800', form: ['W', 'W'], qualified: true },
    { team: TEAMS[2], p: 2, w: 1, l: 1, nr: 0, pts: 2, nrr: '+0.220', form: ['W', 'L'], qualified: false },
    { team: TEAMS[4], p: 2, w: 2, l: 0, nr: 0, pts: 4, nrr: '+1.340', form: ['W', 'W'], qualified: true },
    { team: TEAMS[3], p: 2, w: 1, l: 1, nr: 0, pts: 2, nrr: '-0.250', form: ['L', 'W'], qualified: false }
  ];
}

export function getRankings() {
  return {
    teams: [
      { rank: 1, team: 'India', rating: 268, change: '0' },
      { rank: 2, team: 'Australia', rating: 262, change: '+1' },
      { rank: 3, team: 'England', rating: 255, change: '-1' },
      { rank: 4, team: 'South Africa', rating: 250, change: '0' }
    ],
    batting: [
      { rank: 1, player: 'Suryakumar Yadav', country: 'India', rating: 895, change: '0' },
      { rank: 2, player: 'Travis Head', country: 'Australia', rating: 878, change: '+2' },
      { rank: 3, player: 'Virat Kohli', country: 'India', rating: 820, change: '0' }
    ],
    bowling: [
      { rank: 1, player: 'Jasprit Bumrah', country: 'India', rating: 780, change: '0' },
      { rank: 2, player: 'Adam Zampa', country: 'Australia', rating: 745, change: '+1' }
    ]
  };
}

// =====================================================================
// PLAYER REGISTRATIONS STORE & YEARLY EXPIRY LOGIC
// =====================================================================

const now = Date.now();
const oneDayMs = 24 * 60 * 60 * 1000;
const oneYearMs = 365 * oneDayMs;

let playerRegistrationsList: Array<PlayerRegistration> = [
  {
    id: 101,
    membershipId: 'CRIC-2026-0101',
    fullName: 'Rohit Verma',
    address: 'Flat 402, Sea Green Apts, Worli, Mumbai 400018',
    email: 'rohit.verma@example.com',
    mobileNumber: '+91 98201 12345',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop',
    tshirtSize: 'L',
    pantSize: '32',
    role: 'Batsman',
    paymentMethod: 'UPI (GPay / PhonePe)',
    paymentScreenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
    amountPaid: 2500,
    paymentStatus: 'paid',
    subscriptionStart: new Date(now - 60 * oneDayMs).toISOString(),
    subscriptionEnd: new Date(now + 305 * oneDayMs).toISOString(),
    createdAt: new Date(now - 60 * oneDayMs).toISOString(),
    daysRemaining: 305,
    isExpired: false
  },
  {
    id: 102,
    membershipId: 'CRIC-2026-0102',
    fullName: 'Aakash Patel',
    address: 'B-12 Shivalik Residency, Drive-in Road, Ahmedabad 380052',
    email: 'aakash.patel@example.com',
    mobileNumber: '+91 98795 67890',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop',
    tshirtSize: 'XL',
    pantSize: '34',
    role: 'Allrounder',
    paymentMethod: 'Bank Transfer (IMPS)',
    paymentScreenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
    amountPaid: 2500,
    paymentStatus: 'paid',
    subscriptionStart: new Date(now - 10 * oneDayMs).toISOString(),
    subscriptionEnd: new Date(now + 355 * oneDayMs).toISOString(),
    createdAt: new Date(now - 10 * oneDayMs).toISOString(),
    daysRemaining: 355,
    isExpired: false
  },
  {
    id: 103,
    membershipId: 'CRIC-2025-0045',
    fullName: 'Sameer Khan',
    address: 'Plot 14, Jubilee Hills, Hyderabad 500033',
    email: 'sameer.khan@example.com',
    mobileNumber: '+91 94401 22334',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop',
    tshirtSize: 'M',
    pantSize: '30',
    role: 'Bowler',
    paymentMethod: 'UPI (Paytm)',
    paymentScreenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
    amountPaid: 2500,
    paymentStatus: 'expired',
    subscriptionStart: new Date(now - 395 * oneDayMs).toISOString(),
    subscriptionEnd: new Date(now - 30 * oneDayMs).toISOString(),
    createdAt: new Date(now - 395 * oneDayMs).toISOString(),
    daysRemaining: 0,
    isExpired: true
  }
];

export function getPlayerRegistrations(): PlayerRegistration[] {
  const currentTime = Date.now();
  // Automatically calculate expiry for every registration based on 1-year subscription window
  return playerRegistrationsList.map((reg) => {
    const endMs = new Date(reg.subscriptionEnd).getTime();
    const remainingMs = endMs - currentTime;
    const daysRemaining = Math.max(0, Math.ceil(remainingMs / oneDayMs));
    const isExpired = remainingMs <= 0 || reg.paymentStatus === 'expired';

    return {
      ...reg,
      daysRemaining,
      isExpired,
      paymentStatus: isExpired ? 'expired' : reg.paymentStatus
    };
  });
}

export function registerNewPlayer(input: PlayerRegistrationInput): PlayerRegistration {
  const regId = Date.now();
  const membershipId = `CRIC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + oneYearMs); // Exactly 1-year yearly subscription

  const newRegistration: PlayerRegistration = {
    id: regId,
    membershipId,
    fullName: input.fullName,
    address: input.address,
    email: input.email,
    mobileNumber: input.mobileNumber,
    photoUrl: input.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop',
    tshirtSize: input.tshirtSize,
    pantSize: input.pantSize,
    role: input.role,
    paymentMethod: input.paymentMethod,
    paymentScreenshotUrl: input.paymentScreenshotUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
    amountPaid: input.amountPaid || 2500,
    paymentStatus: 'paid', // User submitted proof
    subscriptionStart: startDate.toISOString(),
    subscriptionEnd: endDate.toISOString(),
    createdAt: startDate.toISOString(),
    daysRemaining: 365,
    isExpired: false
  };

  playerRegistrationsList.unshift(newRegistration);
  return newRegistration;
}

export function updatePlayerPaymentStatus(id: number, status: 'paid' | 'pending' | 'expired'): PlayerRegistration | null {
  const reg = playerRegistrationsList.find((r) => r.id === id);
  if (!reg) return null;

  reg.paymentStatus = status;
  if (status === 'paid' && reg.isExpired) {
    // Renew for 1 year from now
    reg.subscriptionStart = new Date().toISOString();
    reg.subscriptionEnd = new Date(Date.now() + oneYearMs).toISOString();
    reg.daysRemaining = 365;
    reg.isExpired = false;
  }
  return reg;
}

export function findPlayerForLogin(identifier: string): PlayerRegistration | null {
  const all = getPlayerRegistrations();
  const cleanId = identifier.trim().toLowerCase();
  const cleanMobile = cleanId.replace(/[\s\-\+\(\)]/g, '');

  const found = all.find((r) => {
    const memMatch = r.membershipId.toLowerCase() === cleanId;
    const emailMatch = r.email.toLowerCase() === cleanId;
    const phoneClean = r.mobileNumber.replace(/[\s\-\+\(\)]/g, '');
    const phoneMatch = phoneClean.includes(cleanMobile) || cleanMobile.includes(phoneClean);
    return memMatch || emailMatch || (cleanMobile.length >= 8 && phoneMatch);
  });

  return found || null;
}

export function renewPlayerSubscription(id: number): PlayerRegistration | null {
  const reg = playerRegistrationsList.find((r) => r.id === id);
  if (!reg) return null;

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + oneYearMs);

  reg.paymentStatus = 'paid';
  reg.subscriptionStart = startDate.toISOString();
  reg.subscriptionEnd = endDate.toISOString();
  reg.daysRemaining = 365;
  reg.isExpired = false;

  return reg;
}

// =====================================================================
// ALL 10 PAGES & VILLAGE PREMIUM LEAGUE (500 Rs) DATA STORES
// =====================================================================

export interface VillageTeamRegistration {
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
  players: Array<{
    id: number;
    name: string;
    role: 'Batsman' | 'Bowler' | 'Allrounder' | 'Wicket-Keeper';
    tshirtSize: string;
    pantSize: string;
    mobile: string;
    isCaptain?: boolean;
    isViceCaptain?: boolean;
    isReserve?: boolean;
  }>;
  createdAt: string;
}

let villageTeamsList: VillageTeamRegistration[] = [
  {
    id: 1,
    registrationId: 'VPL-PANVEL-001',
    taluka: 'Panvel',
    association: 'Panvel Taluka Cricket Association',
    villageName: 'Panvel Rural',
    teamName: 'Panvel Village Tigers',
    captainName: 'Sachin Patil',
    captainMobile: '+91 98201 54321',
    captainEmail: 'sachin.patil@panvelcricket.com',
    amount: 500,
    paymentMethod: 'UPI (PhonePe)',
    paymentScreenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
    paymentStatus: 'verified',
    createdAt: new Date(Date.now() - 5 * oneDayMs).toISOString(),
    players: [
      { id: 1, name: 'Sachin Patil', role: 'Batsman', tshirtSize: 'L', pantSize: '32', mobile: '+91 98201 54321', isCaptain: true },
      { id: 2, name: 'Prathamesh Gharat', role: 'Bowler', tshirtSize: 'M', pantSize: '30', mobile: '+91 98201 54322', isViceCaptain: true },
      { id: 3, name: 'Rohan Mhatre', role: 'Allrounder', tshirtSize: 'L', pantSize: '32', mobile: '+91 98201 54323' },
      { id: 4, name: 'Mayur Koli', role: 'Wicket-Keeper', tshirtSize: 'M', pantSize: '30', mobile: '+91 98201 54324' },
      { id: 5, name: 'Aniket Thakur', role: 'Batsman', tshirtSize: 'XL', pantSize: '34', mobile: '+91 98201 54325' },
      { id: 6, name: 'Swapnil Bhagat', role: 'Bowler', tshirtSize: 'L', pantSize: '32', mobile: '+91 98201 54326' },
      { id: 7, name: 'Gaurav Patil', role: 'Allrounder', tshirtSize: 'M', pantSize: '30', mobile: '+91 98201 54327' },
      { id: 8, name: 'Nikhil Gaikwad', role: 'Bowler', tshirtSize: 'L', pantSize: '32', mobile: '+91 98201 54328' },
      { id: 9, name: 'Ajinkya Joshi', role: 'Batsman', tshirtSize: 'M', pantSize: '30', mobile: '+91 98201 54329' },
      { id: 10, name: 'Chetan Mokal', role: 'Bowler', tshirtSize: 'L', pantSize: '32', mobile: '+91 98201 54330' },
      { id: 11, name: 'Virendra Deshmukh', role: 'Allrounder', tshirtSize: 'XL', pantSize: '34', mobile: '+91 98201 54331' },
      // 4 Reserves (B players)
      { id: 12, name: 'Tushar Jadhav', role: 'Batsman', tshirtSize: 'L', pantSize: '32', mobile: '+91 98201 54332', isReserve: true },
      { id: 13, name: 'Amol Shinde', role: 'Bowler', tshirtSize: 'M', pantSize: '30', mobile: '+91 98201 54333', isReserve: true },
      { id: 14, name: 'Siddhesh More', role: 'Allrounder', tshirtSize: 'L', pantSize: '32', mobile: '+91 98201 54334', isReserve: true },
      { id: 15, name: 'Kunal Sawant', role: 'Wicket-Keeper', tshirtSize: 'M', pantSize: '30', mobile: '+91 98201 54335', isReserve: true }
    ]
  },
  {
    id: 2,
    registrationId: 'VPL-OWALE-002',
    taluka: 'Panvel',
    association: 'Panvel Taluka Cricket Association',
    villageName: 'Owale',
    teamName: 'Owale Super Kings',
    captainName: 'Dnyaneshwar Mhatre',
    captainMobile: '+91 98334 11223',
    captainEmail: 'owale.kings@cricket.org',
    amount: 500,
    paymentMethod: 'UPI (GPay)',
    paymentScreenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
    paymentStatus: 'verified',
    createdAt: new Date(Date.now() - 3 * oneDayMs).toISOString(),
    players: [
      { id: 1, name: 'Dnyaneshwar Mhatre', role: 'Allrounder', tshirtSize: 'L', pantSize: '32', mobile: '+91 98334 11223', isCaptain: true },
      { id: 2, name: 'Sagar Koli', role: 'Batsman', tshirtSize: 'XL', pantSize: '34', mobile: '+91 98334 11224', isViceCaptain: true },
      { id: 3, name: 'Balaram Patil', role: 'Bowler', tshirtSize: 'M', pantSize: '30', mobile: '+91 98334 11225' },
      { id: 4, name: 'Dinesh Gharat', role: 'Wicket-Keeper', tshirtSize: 'L', pantSize: '32', mobile: '+91 98334 11226' },
      { id: 5, name: 'Omkar Bhagat', role: 'Batsman', tshirtSize: 'M', pantSize: '30', mobile: '+91 98334 11227' },
      { id: 6, name: 'Mahesh Thakur', role: 'Bowler', tshirtSize: 'L', pantSize: '32', mobile: '+91 98334 11228' },
      { id: 7, name: 'Vikas Jadhav', role: 'Allrounder', tshirtSize: 'XL', pantSize: '36', mobile: '+91 98334 11229' },
      { id: 8, name: 'Sunil Pawar', role: 'Bowler', tshirtSize: 'M', pantSize: '30', mobile: '+91 98334 11230' },
      { id: 9, name: 'Akash Salvi', role: 'Batsman', tshirtSize: 'L', pantSize: '32', mobile: '+91 98334 11231' },
      { id: 10, name: 'Kishore Patil', role: 'Bowler', tshirtSize: 'L', pantSize: '32', mobile: '+91 98334 11232' },
      { id: 11, name: 'Pravin Mhatre', role: 'Allrounder', tshirtSize: 'M', pantSize: '30', mobile: '+91 98334 11233' },
      { id: 12, name: 'Rahul Joshi', role: 'Batsman', tshirtSize: 'L', pantSize: '32', mobile: '+91 98334 11234', isReserve: true },
      { id: 13, name: 'Vishal More', role: 'Bowler', tshirtSize: 'M', pantSize: '30', mobile: '+91 98334 11235', isReserve: true },
      { id: 14, name: 'Nitin Kadam', role: 'Allrounder', tshirtSize: 'L', pantSize: '32', mobile: '+91 98334 11236', isReserve: true },
      { id: 15, name: 'Sumit Shinde', role: 'Bowler', tshirtSize: 'XL', pantSize: '34', mobile: '+91 98334 11237', isReserve: true }
    ]
  }
];

export function getVillageTeams(): VillageTeamRegistration[] {
  return villageTeamsList;
}

export function registerVillageTeam(data: {
  taluka: string;
  association: string;
  villageName: string;
  teamName: string;
  captainName: string;
  captainMobile: string;
  captainEmail: string;
  paymentMethod: string;
  paymentScreenshotUrl: string;
  players: any[];
}): VillageTeamRegistration {
  const newId = villageTeamsList.length + 1;
  const regId = `VPL-${data.taluka.toUpperCase().slice(0, 4)}-${String(newId).padStart(3, '0')}`;
  
  const record: VillageTeamRegistration = {
    id: newId,
    registrationId: regId,
    taluka: data.taluka,
    association: data.association || `${data.taluka} Taluka Cricket Association`,
    villageName: data.villageName,
    teamName: data.teamName,
    captainName: data.captainName,
    captainMobile: data.captainMobile,
    captainEmail: data.captainEmail,
    amount: 500, // Fixed 500 Rs
    paymentMethod: data.paymentMethod || 'UPI',
    paymentScreenshotUrl: data.paymentScreenshotUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
    paymentStatus: 'verified',
    createdAt: new Date().toISOString(),
    players: data.players && data.players.length ? data.players : []
  };

  villageTeamsList.unshift(record);
  return record;
}

// 1. SCHEDULE DATA
export function getScheduleData() {
  return [
    {
      id: 101,
      series: "ICC Men's T20 World Cup 2026",
      matchNo: 'Super 8 - Match 28',
      teamA: { name: 'India', shortName: 'IND', logo: '🇮🇳' },
      teamB: { name: 'Australia', shortName: 'AUS', logo: '🇦🇺' },
      dateTime: 'Today, 19:00 IST',
      venue: 'Wankhede Stadium, Mumbai',
      format: 'T20',
      status: 'LIVE',
      category: 'International'
    },
    {
      id: 102,
      series: "Village Premium League 2026 (Taluka Panvel)",
      matchNo: 'Panvel Taluka League - Match 4',
      teamA: { name: 'Panvel Village Tigers', shortName: 'PVT', logo: '🐯' },
      teamB: { name: 'Owale Super Kings', shortName: 'OSK', logo: '👑' },
      dateTime: 'Today, 20:30 IST',
      venue: 'Karnala Sports Academy Ground, Panvel',
      format: 'T20 (Village)',
      status: 'UPCOMING',
      category: 'Village League'
    },
    {
      id: 103,
      series: "ICC Men's T20 World Cup 2026",
      matchNo: 'Super 8 - Match 29',
      teamA: { name: 'England', shortName: 'ENG', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      teamB: { name: 'South Africa', shortName: 'SA', logo: '🇿🇦' },
      dateTime: 'Tomorrow, 15:30 IST',
      venue: 'Eden Gardens, Kolkata',
      format: 'T20',
      status: 'UPCOMING',
      category: 'International'
    },
    {
      id: 104,
      series: "Village Premium League 2026 (Taluka Panvel)",
      matchNo: 'Panvel Taluka League - Match 5',
      teamA: { name: 'Koproli Smashers', shortName: 'KPS', logo: '⚡' },
      teamB: { name: 'Karjat Warriors', shortName: 'KJW', logo: '⚔️' },
      dateTime: 'Tomorrow, 17:00 IST',
      venue: 'Chinchpada Cricket Ground, Panvel',
      format: 'T20 (Village)',
      status: 'UPCOMING',
      category: 'Village League'
    },
    {
      id: 105,
      series: "Indian Premier League 2026",
      matchNo: 'Match 1 - Season Opener',
      teamA: { name: 'Chennai Super Kings', shortName: 'CSK', logo: '🦁' },
      teamB: { name: 'Mumbai Indians', shortName: 'MI', logo: '💙' },
      dateTime: '28 Nov 2026, 19:30 IST',
      venue: 'MA Chidambaram Stadium, Chennai',
      format: 'T20',
      status: 'UPCOMING',
      category: 'League'
    }
  ];
}

// 2. RECENT MATCHES DATA
export function getRecentMatchesData() {
  return [
    {
      id: 201,
      series: "ICC Men's T20 World Cup 2026",
      matchNo: 'Super 8 - Match 27',
      venue: 'M. Chinnaswamy Stadium, Bengaluru',
      date: 'Yesterday, 25 Nov 2026',
      teamA: { name: 'South Africa', shortName: 'SA', score: '178/6', overs: '20.0', logo: '🇿🇦' },
      teamB: { name: 'England', shortName: 'ENG', score: '164/8', overs: '20.0', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      result: 'South Africa won by 14 runs',
      pom: 'Heinrich Klaasen (64 off 34)',
      summary: 'Klaasen blistering 64 and Rabada 3-wicket burst at the death handed South Africa a crucial Super 8 triumph.'
    },
    {
      id: 202,
      series: "Village Premium League 2026 (Taluka Panvel)",
      matchNo: 'Match 3 - Group Stage',
      venue: 'Karnala Sports Academy Ground, Panvel',
      date: '24 Nov 2026',
      teamA: { name: 'Panvel Village Tigers', shortName: 'PVT', score: '194/4', overs: '20.0', logo: '🐯' },
      teamB: { name: 'Koproli Smashers', shortName: 'KPS', score: '162/9', overs: '20.0', logo: '⚡' },
      result: 'Panvel Village Tigers won by 32 runs',
      pom: 'Sachin Patil (82 off 46)',
      summary: 'Captain Sachin Patil led from the front with 82 runs as Panvel Tigers registered their second consecutive victory.'
    },
    {
      id: 203,
      series: "ICC Men's T20 World Cup 2026",
      matchNo: 'Super 8 - Match 26',
      venue: 'Narendra Modi Stadium, Ahmedabad',
      date: '23 Nov 2026',
      teamA: { name: 'India', shortName: 'IND', score: '205/4', overs: '20.0', logo: '🇮🇳' },
      teamB: { name: 'New Zealand', shortName: 'NZ', score: '158/10', overs: '18.2', logo: '🇳🇿' },
      result: 'India won by 47 runs',
      pom: 'Suryakumar Yadav (78* off 36)',
      summary: 'Suryakumar masterclass followed by Bumrah 3/14 restricted New Zealand well short of the target.'
    }
  ];
}

// 3. ACTIVE MATCHES DATA
export function getActiveMatchesData() {
  const live = refreshMatchSnapshot();
  return [
    {
      id: 1,
      series: "ICC Men's T20 World Cup 2026",
      matchNo: 'Super 8 - Match 28 (Featured)',
      venue: 'Wankhede Stadium, Mumbai',
      status: 'LIVE',
      statusNote: live.statusNote,
      teamA: { name: 'India', shortName: 'IND', score: '186/5', overs: '20.0', logo: '🇮🇳' },
      teamB: {
        name: 'Australia',
        shortName: 'AUS',
        score: `${live.currentInnings?.runs}/${live.currentInnings?.wickets}`,
        overs: live.currentInnings?.oversDisplay,
        logo: '🇦🇺'
      },
      currentRunRate: live.currentInnings?.crr,
      requiredRunRate: live.currentInnings?.rrr,
      target: live.currentInnings?.target,
      ballsRemaining: live.currentInnings?.ballsRemaining,
      neededRuns: live.currentInnings?.neededRuns,
      isPrimary: true
    },
    {
      id: 102,
      series: "Village Premium League 2026 (Taluka Panvel)",
      matchNo: 'Panvel Taluka League - Match 4',
      venue: 'Karnala Sports Ground, Panvel',
      status: 'INNINGS BREAK',
      statusNote: 'Panvel Village Tigers set target of 172',
      teamA: { name: 'Panvel Village Tigers', shortName: 'PVT', score: '171/6', overs: '20.0', logo: '🐯' },
      teamB: { name: 'Owale Super Kings', shortName: 'OSK', score: '0/0', overs: '0.0', logo: '👑' },
      currentRunRate: 8.55,
      requiredRunRate: 8.60,
      target: 172,
      isPrimary: false
    }
  ];
}

// 4. NEWS DATA
export function getNewsData() {
  return [
    {
      id: 1,
      category: 'World Cup 2026',
      title: 'India vs Australia Super 8: Maxwell and Stoinis Lead Thrilling Chase at Wankhede',
      date: '10 mins ago',
      author: 'Cricket Analysis Desk',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
      readTime: '4 min read',
      excerpt: 'With 42 runs required off 22 balls, Glenn Maxwell and Marcus Stoinis have taken the attack to the Indian bowlers in a breath-taking finish.'
    },
    {
      id: 2,
      category: 'Village Premium League',
      title: 'Panvel Taluka Cricket Association Announces 2026 Village Cup: 500 Rs Registration Open',
      date: '1 hour ago',
      author: 'PTCA Official Media',
      image: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=800&auto=format&fit=crop',
      readTime: '3 min read',
      excerpt: 'Village teams across Panvel, Uran, Karjat, and Alibaug can now register their 15-player squad (A players + B reserves) with official match kit sizing.'
    },
    {
      id: 3,
      category: 'Tactical Analysis',
      title: 'Jasprit Bumrah Death-Bowling Masterclass: Deconstructing The 140km/h Yorker Arc',
      date: '3 hours ago',
      author: 'Bowling Lab Insights',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
      readTime: '5 min read',
      excerpt: 'Bumrah has conceded only 16 boundaries in the death overs across the tournament while picking 12 wickets.'
    },
    {
      id: 4,
      category: 'IPL 2026',
      title: 'IPL 2026 Season Kickoff Announced: CSK to Host MI at Chepauk in High-Octane Opener',
      date: '5 hours ago',
      author: 'League Central',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
      readTime: '3 min read',
      excerpt: 'The world biggest franchise cricket league is set to begin as arch-rivals collide under the Chennai lights.'
    }
  ];
}

// 5. SERIES DATA
export function getSeriesData() {
  return [
    {
      id: 't20wc-2026',
      name: "ICC Men's T20 World Cup 2026",
      host: 'India & Sri Lanka',
      dates: '01 Nov - 05 Dec 2026',
      format: 'T20 International',
      totalTeams: 20,
      totalMatches: 55,
      currentStage: 'Super 8 Stage',
      topBatter: 'Suryakumar Yadav (384 runs)',
      topBowler: 'Jasprit Bumrah (15 wickets)',
      status: 'Active'
    },
    {
      id: 'vpl-2026',
      name: 'Village Premium League 2026',
      host: 'Panvel Taluka Cricket Association',
      dates: '15 Nov - 10 Dec 2026',
      format: 'T20 Village Knockout',
      totalTeams: 16,
      totalMatches: 31,
      currentStage: 'Taluka League Stage (₹500 Fee)',
      topBatter: 'Sachin Patil (245 runs)',
      topBowler: 'Prathamesh Gharat (11 wickets)',
      status: 'Active'
    },
    {
      id: 'ipl-2026',
      name: 'Indian Premier League 2026',
      host: 'BCCI, India',
      dates: '28 Nov 2026 - 15 Jan 2027',
      format: 'T20 Franchise',
      totalTeams: 10,
      totalMatches: 74,
      currentStage: 'Upcoming',
      status: 'Upcoming'
    }
  ];
}

// 6. TEAMS DATA (International & Village Taluka Teams with 15 Players)
export function getTeamsData() {
  return [
    {
      id: 1,
      name: 'India',
      shortName: 'IND',
      type: 'International',
      country: 'India',
      captain: 'Rohit Sharma',
      coach: 'Gautam Gambhir',
      logo: '🇮🇳',
      color: '#0055A5',
      played: 5,
      won: 5,
      lost: 0,
      ranking: 1,
      squad15: [
        'Rohit Sharma (C)', 'Virat Kohli', 'Suryakumar Yadav', 'Rishabh Pant (WK)',
        'Hardik Pandya', 'Ravindra Jadeja', 'Jasprit Bumrah', 'Arshdeep Singh',
        'Kuldeep Yadav', 'Shubman Gill', 'Mohammed Siraj',
        'Sanju Samson (Res)', 'Axar Patel (Res)', 'Yuzvendra Chahal (Res)', 'Shivam Dube (Res)'
      ]
    },
    {
      id: 2,
      name: 'Australia',
      shortName: 'AUS',
      type: 'International',
      country: 'Australia',
      captain: 'Pat Cummins',
      coach: 'Andrew McDonald',
      logo: '🇦🇺',
      color: '#FFD100',
      played: 5,
      won: 4,
      lost: 1,
      ranking: 2,
      squad15: [
        'Travis Head', 'David Warner', 'Mitchell Marsh', 'Glenn Maxwell',
        'Marcus Stoinis', 'Josh Inglis (WK)', 'Pat Cummins (C)', 'Mitchell Starc',
        'Adam Zampa', 'Josh Hazlewood', 'Steven Smith',
        'Tim David (Res)', 'Nathan Ellis (Res)', 'Ashton Agar (Res)', 'Matthew Wade (Res)'
      ]
    },
    {
      id: 101,
      name: 'Panvel Village Tigers',
      shortName: 'PVT',
      type: 'Village League',
      taluka: 'Panvel',
      association: 'Panvel Taluka Cricket Association',
      village: 'Panvel Rural',
      captain: 'Sachin Patil',
      coach: 'Ramesh Gharat',
      logo: '🐯',
      color: '#10b981',
      played: 3,
      won: 3,
      lost: 0,
      ranking: 1,
      squad15: [
        'Sachin Patil (C)', 'Prathamesh Gharat (VC)', 'Rohan Mhatre', 'Mayur Koli (WK)',
        'Aniket Thakur', 'Swapnil Bhagat', 'Gaurav Patil', 'Nikhil Gaikwad',
        'Ajinkya Joshi', 'Chetan Mokal', 'Virendra Deshmukh',
        'Tushar Jadhav (B-Res)', 'Amol Shinde (B-Res)', 'Siddhesh More (B-Res)', 'Kunal Sawant (B-Res)'
      ]
    },
    {
      id: 102,
      name: 'Owale Super Kings',
      shortName: 'OSK',
      type: 'Village League',
      taluka: 'Panvel',
      association: 'Panvel Taluka Cricket Association',
      village: 'Owale',
      captain: 'Dnyaneshwar Mhatre',
      coach: 'Santosh Bhagat',
      logo: '👑',
      color: '#eab308',
      played: 3,
      won: 2,
      lost: 1,
      ranking: 2,
      squad15: [
        'Dnyaneshwar Mhatre (C)', 'Sagar Koli (VC)', 'Balaram Patil', 'Dinesh Gharat (WK)',
        'Omkar Bhagat', 'Mahesh Thakur', 'Vikas Jadhav', 'Sunil Pawar',
        'Akash Salvi', 'Kishore Patil', 'Pravin Mhatre',
        'Rahul Joshi (B-Res)', 'Vishal More (B-Res)', 'Nitin Kadam (B-Res)', 'Sumit Shinde (B-Res)'
      ]
    }
  ];
}

// 7. VIDEOS DATA
export function getVideosData() {
  return [
    {
      id: 1,
      title: 'IND vs AUS: Glenn Maxwell Monster 108m Six Over Long-On at Wankhede',
      category: 'Match Highlights',
      duration: '03:15',
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
      views: '1.4M views',
      date: '2 hours ago',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 2,
      title: 'Bumrah Unplayable Reverse Swing Yorker To Dismiss Travis Head',
      category: 'Wickets Reel',
      duration: '01:45',
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
      views: '890K views',
      date: '4 hours ago',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 3,
      title: 'Village Premium League: Sachin Patil 82 Runs Fireworks in Panvel Derby',
      category: 'Village Highlights',
      duration: '04:20',
      thumbnail: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=800&auto=format&fit=crop',
      views: '240K views',
      date: '1 day ago',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 4,
      title: 'Post-Match Press Conference: Rohit Sharma Analyzes Super 8 Strategy',
      category: 'Press Meets',
      duration: '06:10',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
      views: '450K views',
      date: '1 day ago',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];
}

// 8. RANKINGS & BEST TEAM DATA (Note: Compulsory 100 for top ranking)
export function getRankingsData() {
  return {
    topRankingCriteria: 'Compulsory 100 points minimum performance benchmark for Top Ranking',
    teamRankings: [
      { rank: 1, team: 'India', points: 3450, rating: 268, change: '0', badge: '🥇 World No.1' },
      { rank: 2, team: 'Australia', points: 3120, rating: 262, change: '+1', badge: '🥈 Top Contender' },
      { rank: 3, team: 'England', points: 2890, rating: 255, change: '-1', badge: '🥉 Podium' },
      { rank: 4, team: 'South Africa', points: 2750, rating: 250, change: '0', badge: 'Super 8' }
    ],
    battingRankings: [
      { rank: 1, player: 'Suryakumar Yadav', country: 'India', rating: 895, matches: 68, top100Points: 100 },
      { rank: 2, player: 'Travis Head', country: 'Australia', rating: 878, matches: 45, top100Points: 100 },
      { rank: 3, player: 'Virat Kohli', country: 'India', rating: 820, matches: 125, top100Points: 100 },
      { rank: 4, player: 'Glenn Maxwell', country: 'Australia', rating: 792, matches: 108, top100Points: 100 }
    ],
    bowlingRankings: [
      { rank: 1, player: 'Jasprit Bumrah', country: 'India', rating: 780, wickets: 92, top100Points: 100 },
      { rank: 2, player: 'Adam Zampa', country: 'Australia', rating: 745, wickets: 88, top100Points: 100 },
      { rank: 3, player: 'Arshdeep Singh', country: 'India', rating: 710, wickets: 65, top100Points: 100 },
      { rank: 4, player: 'Pat Cummins', country: 'Australia', rating: 695, wickets: 74, top100Points: 100 }
    ],
    // "BEST TEAM" (Dream XI / Tournament Best Team Showcase)
    bestTeamXI: {
      title: "World & League Best Team XI",
      subtitle: "Official Best Playing XI selected based on ICC Ratings & Top 100 Ranking Points",
      captain: "Rohit Sharma",
      wicketKeeper: "Rishabh Pant",
      coach: "Gautam Gambhir",
      players: [
        { no: 1, name: 'Rohit Sharma', role: 'Batsman (Captain)', country: 'India', rating: 810, pos: 'Opening Batter' },
        { no: 2, name: 'Travis Head', role: 'Batsman', country: 'Australia', rating: 878, pos: 'Opening Batter' },
        { no: 3, name: 'Virat Kohli', role: 'Batsman', country: 'India', rating: 820, pos: 'Top Order' },
        { no: 4, name: 'Suryakumar Yadav', role: 'Batsman', country: 'India', rating: 895, pos: 'Middle Order' },
        { no: 5, name: 'Rishabh Pant', role: 'Wicket-Keeper', country: 'India', rating: 765, pos: 'WK / Batter' },
        { no: 6, name: 'Hardik Pandya', role: 'All-Rounder', country: 'India', rating: 780, pos: 'Fast Bowling All-Rounder' },
        { no: 7, name: 'Glenn Maxwell', role: 'All-Rounder', country: 'Australia', rating: 792, pos: 'Spin All-Rounder' },
        { no: 8, name: 'Pat Cummins', role: 'Bowler', country: 'Australia', rating: 695, pos: 'Fast Bowler' },
        { no: 9, name: 'Mitchell Starc', role: 'Bowler', country: 'Australia', rating: 715, pos: 'Left-Arm Fast' },
        { no: 10, name: 'Jasprit Bumrah', role: 'Bowler', country: 'India', rating: 780, pos: 'Spearhead Death Bowler' },
        { no: 11, name: 'Adam Zampa', role: 'Bowler', country: 'Australia', rating: 745, pos: 'Leg-Spinner' }
      ]
    }
  };
}

// 9. MORE DATA (Records, Grounds, Rules, FAQ)
export function getMoreData() {
  return {
    records: [
      { title: 'Highest Team Total in T20', record: '260/6', holder: 'India vs Sri Lanka', date: 'Indore' },
      { title: 'Fastest Century', record: '35 balls', holder: 'Rohit Sharma', date: '2017' },
      { title: 'Most Sixes in T20 Internationals', record: '205 Sixes', holder: 'Rohit Sharma', date: 'All-Time' },
      { title: 'Best Bowling Figures', record: '6/7', holder: 'Deepak Chahar', date: 'Nagpur' }
    ],
    venues: [
      { name: 'Wankhede Stadium', city: 'Mumbai', capacity: '33,108', established: '1974' },
      { name: 'Karnala Sports Academy Ground', city: 'Panvel, Raigad', capacity: '8,000', established: '2008', league: 'Village Premium League' },
      { name: 'Eden Gardens', city: 'Kolkata', capacity: '66,000', established: '1864' },
      { name: 'Chinchpada Cricket Ground', city: 'Panvel', capacity: '5,000', established: '2012', league: 'Village Premium League' }
    ],
    rules: [
      { title: 'Powerplay Overs', text: 'Overs 1 to 6 in T20 allow maximum 2 fielders outside the 30-yard ring.' },
      { title: 'Free Hit Rule', text: 'Any front-foot or height no-ball incurs a free hit next delivery.' },
      { title: 'Village League Playing XI Rule', text: 'Squad must submit 11 active players + 4 reserves. Compulsory 500 Rs team registration fee.' }
    ]
  };
}


