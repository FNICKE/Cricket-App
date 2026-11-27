export interface BattingScore {
  playerId: number;
  playerName: string;
  battingOrder: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  isOnStrike: boolean;
  isBatting: boolean;
  dismissalText?: string;
}

export interface BowlingFigure {
  playerId: number;
  playerName: string;
  legalBalls: number;
  oversDisplay: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  isBowling: boolean;
}

export interface InningsState {
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
  recentBalls: string[];
  strikerId?: number;
  nonStrikerId?: number;
  currentBowlerId?: number;
}

export interface MatchState {
  matchId: number;
  seriesName: string;
  matchNo: string;
  venueName: string;
  teamA: { shortName: string; name: string };
  teamB: { shortName: string; name: string };
  status: string;
  statusNote?: string;
  resultText?: string;
  currentInnings?: InningsState;
  innings: InningsState[];
  version: number;
}

export interface CommentaryItem {
  id: number;
  headline?: string;
  text: string;
  runs?: number;
  isWicket?: boolean;
  isBoundary?: boolean;
}

export type AdminRole = 'super_admin' | 'scorer';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: AdminRole;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
}

export interface AdminOverview {
  matches: Array<{
    matchId: number;
    series: string;
    matchNo: string;
    status: string;
    statusNote?: string;
    teamA: { shortName: string; score: string };
    teamB: { shortName: string; score: string };
  }>;
  scorers: Array<{
    id: number;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  }>;
  registrations: { total: number; paid: number; pending: number; expired: number };
}
