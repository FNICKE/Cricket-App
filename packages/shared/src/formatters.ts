// =====================================================================
// CRICKET FORMATTERS & STATISTICAL FORMULAS
// =====================================================================

/**
 * Converts legal balls into cricket over notation (e.g., 98 legal balls -> "16.2")
 */
export function legalBallsToOvers(legalBalls: number): string {
  if (legalBalls <= 0) return '0.0';
  const completedOvers = Math.floor(legalBalls / 6);
  const remainingBalls = legalBalls % 6;
  return `${completedOvers}.${remainingBalls}`;
}

/**
 * Converts over notation (e.g. "16.2" or 16.2) back to legal balls count (98)
 */
export function oversToLegalBalls(overs: number | string): number {
  const parts = String(overs).split('.');
  const wholeOvers = parseInt(parts[0] || '0', 10);
  const balls = parseInt(parts[1] || '0', 10);
  return wholeOvers * 6 + balls;
}

/**
 * Current Run Rate (CRR) = Total Runs / (Legal Balls / 6)
 */
export function calculateCRR(runs: number, legalBalls: number): number {
  if (legalBalls <= 0) return 0.0;
  const overs = legalBalls / 6;
  return Number((runs / overs).toFixed(2));
}

/**
 * Required Run Rate (RRR) = (Target - Current Runs) / (Balls Remaining / 6)
 */
export function calculateRRR(target: number, currentRuns: number, ballsRemaining: number): number {
  const runsNeeded = target - currentRuns;
  if (runsNeeded <= 0) return 0.0;
  if (ballsRemaining <= 0) return 99.99;
  const oversRemaining = ballsRemaining / 6;
  return Number((runsNeeded / oversRemaining).toFixed(2));
}

/**
 * Batter Strike Rate = (Runs / Balls Faced) * 100
 */
export function calculateStrikeRate(runs: number, ballsFaced: number): number {
  if (ballsFaced <= 0) return 0.0;
  return Number(((runs / ballsFaced) * 100).toFixed(2));
}

/**
 * Bowler Economy = Runs Conceded / (Legal Balls / 6)
 */
export function calculateEconomy(runsConceded: number, legalBalls: number): number {
  if (legalBalls <= 0) return 0.0;
  const overs = legalBalls / 6;
  return Number((runsConceded / overs).toFixed(2));
}

/**
 * Net Run Rate (NRR) Formula:
 * NRR = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)
 */
export function calculateNRR(
  runsScored: number,
  oversFaced: number,
  runsConceded: number,
  oversBowled: number
): number {
  const forRate = oversFaced > 0 ? runsScored / oversFaced : 0;
  const againstRate = oversBowled > 0 ? runsConceded / oversBowled : 0;
  return Number((forRate - againstRate).toFixed(3));
}

/**
 * Formats ball chip display for the recent balls strip (e.g., 'W', '4', '6', '1', 'Wd', 'Nb')
 */
export function formatBallBadge(ball: {
  runsBat: number;
  extraType?: string | null;
  extraRuns?: number;
  isWicket?: boolean;
}): { text: string; color: 'dot' | 'run' | 'boundary' | 'wicket' | 'extra' } {
  if (ball.isWicket) {
    return { text: 'W', color: 'wicket' };
  }
  if (ball.extraType === 'wd') {
    const totalExtra = 1 + (ball.extraRuns || 0);
    return { text: totalExtra > 1 ? `${totalExtra}wd` : 'wd', color: 'extra' };
  }
  if (ball.extraType === 'nb') {
    const runs = (ball.extraRuns || 0) + (ball.runsBat || 0);
    return { text: runs > 0 ? `${runs}nb` : 'nb', color: 'extra' };
  }
  if (ball.extraType === 'b') {
    return { text: `${ball.extraRuns || 1}b`, color: 'extra' };
  }
  if (ball.extraType === 'lb') {
    return { text: `${ball.extraRuns || 1}lb`, color: 'extra' };
  }
  if (ball.runsBat === 4) {
    return { text: '4', color: 'boundary' };
  }
  if (ball.runsBat === 6) {
    return { text: '6', color: 'boundary' };
  }
  if (ball.runsBat === 0) {
    return { text: '•', color: 'dot' };
  }
  return { text: String(ball.runsBat), color: 'run' };
}
