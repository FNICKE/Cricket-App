// =====================================================================
// CRICKET TYPES & INTERFACES
// =====================================================================

export type MatchFormat = 'T20' | 'ODI' | 'TEST' | 'T10';

export type MatchStatus =
  | 'scheduled'
  | 'toss'
  | 'live'
  | 'break'
  | 'stumps'
  | 'completed'
  | 'abandoned'
  | 'no_result';

export type TossDecision = 'bat' | 'bowl';

export type ExtraType = 'wd' | 'nb' | 'b' | 'lb' | 'p' | null;

export type DismissalType =
  | 'bowled'
  | 'caught'
  | 'caught_and_bowled'
  | 'lbw'
  | 'run_out'
  | 'stumped'
  | 'hit_wicket'
  | 'retired_hurt'
  | 'retired_out'
  | 'obstructing_the_field'
  | 'timed_out'
  | 'hit_the_ball_twice';

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logoUrl?: string;
  primaryColor?: string;
  teamType: 'international' | 'domestic' | 'league' | 'women';
  country: string;
}

export interface Player {
  id: number;
  fullName: string;
  shortName: string;
  dob?: string;
  country: string;
  role: 'batsman' | 'bowler' | 'all_rounder' | 'wicket_keeper';
  battingStyle?: string;
  bowlingStyle?: string;
  photoUrl?: string;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
  country: string;
  capacity?: number;
  ends?: string;
}

export interface BallInput {
  clientUuid?: string;
  runsBat: number;
  extraType?: ExtraType;
  extraRuns?: number;
  isLegal?: boolean;
  isFour?: boolean;
  isSix?: boolean;
  isWicket?: boolean;
  dismissalType?: DismissalType;
  outPlayerId?: number;
  fielder1Id?: number;
  fielder2Id?: number;
  isFreeHit?: boolean;
  shotZone?: number;
  pitchZone?: number;
  commentary?: string;
  strikerId?: number;
  nonStrikerId?: number;
  bowlerId?: number;
}

export interface BallRecord extends BallInput {
  id: number;
  inningsId: number;
  seq: number;
  overNo: number;
  ballInOver: number;
  bowlerId: number;
  strikerId: number;
  nonStrikerId: number;
  isLegal: boolean;
  createdAt: string;
}

export interface BattingScore {
  playerId: number;
  playerName: string;
  battingOrder: number;
  runs: number;
  balls: number;
  dotBalls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissalType?: DismissalType;
  dismissalText?: string;
  bowlerName?: string;
  fielderName?: string;
  isOut: boolean;
  isOnStrike: boolean;
  isBatting: boolean;
}

export interface BowlingFigure {
  playerId: number;
  playerName: string;
  bowlingOrder: number;
  legalBalls: number;
  oversDisplay: string; // e.g. "3.2"
  maidens: number;
  runs: number;
  wickets: number;
  wides: number;
  noBalls: number;
  dotBalls: number;
  economy: number;
  isBowling: boolean;
}

export interface Partnership {
  wicketNo: number;
  player1Id: number;
  player1Name: string;
  player1Runs: number;
  player1Balls: number;
  player2Id: number;
  player2Name: string;
  player2Runs: number;
  player2Balls: number;
  totalRuns: number;
  totalBalls: number;
  isActive: boolean;
}

export interface FallOfWicket {
  wicketNo: number;
  playerId: number;
  playerName: string;
  score: number;
  overDisplay: string;
  legalBalls: number;
}

export interface InningsState {
  id: number;
  matchId: number;
  inningsNo: number;
  battingTeamId: number;
  bowlingTeamId: number;
  battingTeamName: string;
  bowlingTeamName: string;
  battingTeamShort: string;
  bowlingTeamShort: string;
  runs: number;
  wickets: number;
  legalBalls: number;
  oversDisplay: string; // e.g. "16.2"
  crr: number;
  rrr?: number;
  target?: number;
  neededRuns?: number;
  ballsRemaining?: number;
  status: 'live' | 'completed';
  battingScores: BattingScore[];
  bowlingFigures: BowlingFigure[];
  currentPartnership?: Partnership;
  fallOfWickets: FallOfWicket[];
  recentBalls: string[]; // e.g. ["1", "4", "0", "W", "|", "2", "6"]
  strikerId?: number;
  nonStrikerId?: number;
  currentBowlerId?: number;
}

export interface MatchLiveState {
  matchId: number;
  seriesName: string;
  matchNo: string;
  format: MatchFormat;
  venueName: string;
  venueCity: string;
  teamA: Team;
  teamB: Team;
  tossWinner?: string;
  tossDecision?: TossDecision;
  status: MatchStatus;
  statusNote?: string;
  resultText?: string;
  currentInningsNo: number;
  innings: InningsState[];
  currentInnings?: InningsState;
  version: number;
}

export interface CommentaryItem {
  id: number;
  matchId: number;
  inningsId?: number;
  overNo?: number;
  ballNo?: number;
  type: 'ball' | 'over_summary' | 'status' | 'milestone' | 'text';
  headline?: string;
  text: string;
  runs?: number;
  isWicket?: boolean;
  isBoundary?: boolean;
  createdAt: string;
}

// =====================================================================
// PLAYER REGISTRATION & YEARLY MEMBERSHIP
// =====================================================================

export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';
export type PantSize = '28' | '30' | '32' | '34' | '36' | '38' | '40';
export type CricketRole = 'Batsman' | 'Bowler' | 'Allrounder' | 'Wicket-Keeper';
export type PaymentStatus = 'paid' | 'pending' | 'expired';

export interface PlayerRegistrationInput {
  fullName: string;
  address: string;
  email: string;
  mobileNumber: string;
  photoUrl?: string;
  tshirtSize: TShirtSize;
  pantSize: PantSize;
  role: CricketRole;
  paymentMethod: string;
  paymentScreenshotUrl?: string;
  amountPaid?: number;
}

export interface PlayerRegistration extends PlayerRegistrationInput {
  id: number;
  membershipId: string;
  paymentStatus: PaymentStatus;
  subscriptionStart: string;
  subscriptionEnd: string;
  createdAt: string;
  daysRemaining: number;
  isExpired: boolean;
}

