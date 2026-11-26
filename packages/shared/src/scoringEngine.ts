// =====================================================================
// PURE CRICKET SCORING ENGINE
// =====================================================================

import type {
  BallInput,
  BallRecord,
  BattingScore,
  BowlingFigure,
  InningsState,
  Partnership,
  FallOfWicket,
  DismissalType
} from './types.ts';
import {
  legalBallsToOvers,
  calculateCRR,
  calculateRRR,
  calculateStrikeRate,
  calculateEconomy,
  formatBallBadge
} from './formatters.ts';

export interface ScorecardComputationResult {
  runs: number;
  wickets: number;
  legalBalls: number;
  oversDisplay: string;
  crr: number;
  rrr?: number;
  ex_b: number;
  ex_lb: number;
  ex_wd: number;
  ex_nb: number;
  ex_p: number;
  battingScores: BattingScore[];
  bowlingFigures: BowlingFigure[];
  currentPartnership?: Partnership;
  partnerships: Partnership[];
  fallOfWickets: FallOfWicket[];
  recentBalls: string[];
  strikerId?: number;
  nonStrikerId?: number;
  currentBowlerId?: number;
  isOverEnded: boolean;
  isInningsEnded: boolean;
}

export function isDismissalCreditedToBowler(dismissal?: DismissalType): boolean {
  if (!dismissal) return false;
  return [
    'bowled',
    'caught',
    'caught_and_bowled',
    'lbw',
    'stumped',
    'hit_wicket'
  ].includes(dismissal);
}

/**
 * Recomputes the entire innings state from the sequence of ball deliveries.
 * This guarantees the single-source-of-truth invariant:
 * "Store every ball as one immutable row in balls, and compute every total from that log."
 */
export function recomputeInningsFromBalls(params: {
  matchId: number;
  inningsNo: number;
  maxOvers?: number; // e.g. 20 for T20, 50 for ODI
  target?: number;
  balls: BallRecord[];
  allBatters: { id: number; name: string }[];
  allBowlers: { id: number; name: string }[];
  initialStrikerId?: number;
  initialNonStrikerId?: number;
  initialBowlerId?: number;
}): ScorecardComputationResult {
  const {
    balls,
    maxOvers = 20,
    target,
    allBatters,
    allBowlers,
    initialStrikerId,
    initialNonStrikerId,
    initialBowlerId
  } = params;

  let runs = 0;
  let wickets = 0;
  let legalBalls = 0;
  let ex_b = 0;
  let ex_lb = 0;
  let ex_wd = 0;
  let ex_nb = 0;
  let ex_p = 0;

  let currentStrikerId = initialStrikerId;
  let currentNonStrikerId = initialNonStrikerId;
  let currentBowlerId = initialBowlerId;

  // Track batting scores
  const battingMap = new Map<number, BattingScore>();
  allBatters.forEach((b, idx) => {
    battingMap.set(b.id, {
      playerId: b.id,
      playerName: b.name,
      battingOrder: idx + 1,
      runs: 0,
      balls: 0,
      dotBalls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      isOnStrike: false,
      isBatting: false
    });
  });

  // Track bowling figures
  const bowlingMap = new Map<number, BowlingFigure>();
  allBowlers.forEach((bw, idx) => {
    bowlingMap.set(bw.id, {
      playerId: bw.id,
      playerName: bw.name,
      bowlingOrder: idx + 1,
      legalBalls: 0,
      oversDisplay: '0.0',
      maidens: 0,
      runs: 0,
      wickets: 0,
      wides: 0,
      noBalls: 0,
      dotBalls: 0,
      economy: 0,
      isBowling: false
    });
  });

  // Track over runs for maidens
  const overRunsMap = new Map<number, { runsChargedToBowler: number; legalBalls: number }>();

  // Partnerships and Fall of Wickets
  const fallOfWickets: FallOfWicket[] = [];
  const partnerships: Partnership[] = [];
  let currentPartRuns = 0;
  let currentPartBalls = 0;
  let p1Runs = 0;
  let p1Balls = 0;
  let p2Runs = 0;
  let p2Balls = 0;

  const recentBallsList: string[] = [];

  // Sort balls by seq
  const sortedBalls = [...balls].sort((a, b) => a.seq - b.seq);

  for (const ball of sortedBalls) {
    currentStrikerId = ball.strikerId;
    currentNonStrikerId = ball.nonStrikerId;
    currentBowlerId = ball.bowlerId;

    const batter = battingMap.get(ball.strikerId);
    if (batter) {
      batter.isBatting = true;
    }
    const nonStriker = battingMap.get(ball.nonStrikerId);
    if (nonStriker) {
      nonStriker.isBatting = true;
    }

    const bowler = bowlingMap.get(ball.bowlerId);
    if (bowler) {
      bowler.isBowling = true;
    }

    const overObj = overRunsMap.get(ball.overNo) || { runsChargedToBowler: 0, legalBalls: 0 };

    let teamRunsForBall = 0;
    let bowlerRunsForBall = 0;
    let batterRunsForBall = ball.runsBat || 0;

    // Check Extras
    if (ball.extraType === 'wd') {
      const extra = 1 + (ball.extraRuns || 0);
      teamRunsForBall += extra;
      bowlerRunsForBall += extra;
      ex_wd += extra;
      if (bowler) bowler.wides += 1;
    } else if (ball.extraType === 'nb') {
      const extra = 1;
      ex_nb += extra;
      teamRunsForBall += extra + batterRunsForBall;
      bowlerRunsForBall += extra + batterRunsForBall;
      if (bowler) bowler.noBalls += 1;
      if (batter) {
        batter.runs += batterRunsForBall;
        batter.balls += 1; // counts as ball faced
        if (batterRunsForBall === 4) batter.fours += 1;
        if (batterRunsForBall === 6) batter.sixes += 1;
      }
    } else if (ball.extraType === 'b') {
      const extra = ball.extraRuns || 0;
      ex_b += extra;
      teamRunsForBall += extra;
      // byes are not charged to bowler
      if (batter) {
        batter.balls += 1;
      }
    } else if (ball.extraType === 'lb') {
      const extra = ball.extraRuns || 0;
      ex_lb += extra;
      teamRunsForBall += extra;
      // leg byes are not charged to bowler
      if (batter) {
        batter.balls += 1;
      }
    } else if (ball.extraType === 'p') {
      const extra = ball.extraRuns || 5;
      ex_p += extra;
      teamRunsForBall += extra;
    } else {
      // Normal delivery off the bat
      teamRunsForBall += batterRunsForBall;
      bowlerRunsForBall += batterRunsForBall;
      if (batter) {
        batter.runs += batterRunsForBall;
        batter.balls += 1;
        if (batterRunsForBall === 0) batter.dotBalls += 1;
        if (batterRunsForBall === 4) batter.fours += 1;
        if (batterRunsForBall === 6) batter.sixes += 1;
      }
    }

    runs += teamRunsForBall;

    // Bowler updates
    if (bowler) {
      bowler.runs += bowlerRunsForBall;
      if (ball.isLegal) {
        bowler.legalBalls += 1;
        if (teamRunsForBall === 0 && !ball.extraType) {
          bowler.dotBalls += 1;
        }
      }
    }

    // Over legal ball increment
    if (ball.isLegal) {
      legalBalls += 1;
      overObj.legalBalls += 1;
      currentPartBalls += 1;
      if (batter?.playerId === currentStrikerId) {
        p1Balls += 1;
      } else {
        p2Balls += 1;
      }
    }
    overObj.runsChargedToBowler += bowlerRunsForBall;
    overRunsMap.set(ball.overNo, overObj);

    currentPartRuns += teamRunsForBall;
    if (batter?.playerId === currentStrikerId) {
      p1Runs += batterRunsForBall;
    } else {
      p2Runs += batterRunsForBall;
    }

    // Recent balls formatting
    const badge = formatBallBadge(ball);
    recentBallsList.push(badge.text);

    // Wicket handling
    if (ball.isWicket) {
      wickets += 1;
      const outPlayerId = ball.outPlayerId || currentStrikerId;
      const outBatter = battingMap.get(outPlayerId);
      if (outBatter) {
        outBatter.isOut = true;
        outBatter.isBatting = false;
        outBatter.dismissalType = ball.dismissalType;
        outBatter.dismissalText = ball.commentary || 'out';
      }

      if (isDismissalCreditedToBowler(ball.dismissalType) && bowler) {
        bowler.wickets += 1;
      }

      // Record Fall of Wicket
      fallOfWickets.push({
        wicketNo: wickets,
        playerId: outPlayerId,
        playerName: outBatter?.playerName || 'Batter',
        score: runs,
        overDisplay: legalBallsToOvers(legalBalls),
        legalBalls
      });

      // End partnership
      partnerships.push({
        wicketNo: wickets,
        player1Id: currentStrikerId || 0,
        player1Name: battingMap.get(currentStrikerId || 0)?.playerName || '',
        player1Runs: p1Runs,
        player1Balls: p1Balls,
        player2Id: currentNonStrikerId || 0,
        player2Name: battingMap.get(currentNonStrikerId || 0)?.playerName || '',
        player2Runs: p2Runs,
        player2Balls: p2Balls,
        totalRuns: currentPartRuns,
        totalBalls: currentPartBalls,
        isActive: false
      });

      // Reset active partnership counters
      currentPartRuns = 0;
      currentPartBalls = 0;
      p1Runs = 0;
      p1Balls = 0;
      p2Runs = 0;
      p2Balls = 0;
    }

    // Strike Rotation Rules
    // Runs that involve running between wickets: 1, 3 (odd numbers)
    let shouldSwapStrike = false;
    const runsRun = ball.extraType === 'wd' ? (ball.extraRuns || 0) : (ball.runsBat || 0);
    const extraRunsRun = (ball.extraType === 'b' || ball.extraType === 'lb') ? (ball.extraRuns || 0) : 0;
    const totalPhysicalRuns = runsRun + extraRunsRun;

    if (totalPhysicalRuns % 2 === 1) {
      shouldSwapStrike = !shouldSwapStrike;
    }

    // Check if over ended on this ball (6 legal balls in over)
    const overJustEnded = ball.isLegal && ball.ballInOver === 6;
    if (overJustEnded) {
      // Batsmen swap ends at over end
      shouldSwapStrike = !shouldSwapStrike;
      recentBallsList.push('|');
    }

    if (shouldSwapStrike) {
      const temp = currentStrikerId;
      currentStrikerId = currentNonStrikerId;
      currentNonStrikerId = temp;
    }
  }

  // Calculate maidens
  for (const [, overData] of overRunsMap.entries()) {
    if (overData.legalBalls === 6 && overData.runsChargedToBowler === 0) {
      // Find bowler who bowled this over from balls
      const sampleBall = sortedBalls.find((b) => b.isLegal && b.ballInOver === 6);
      if (sampleBall) {
        const b = bowlingMap.get(sampleBall.bowlerId);
        if (b) b.maidens += 1;
      }
    }
  }

  // Finalize batting stats
  for (const b of battingMap.values()) {
    b.strikeRate = calculateStrikeRate(b.runs, b.balls);
    b.isOnStrike = b.playerId === currentStrikerId;
  }

  // Finalize bowling stats
  for (const bw of bowlingMap.values()) {
    bw.oversDisplay = legalBallsToOvers(bw.legalBalls);
    bw.economy = calculateEconomy(bw.runs, bw.legalBalls);
  }

  // Active partnership
  let activePartnership: Partnership | undefined;
  if (currentStrikerId && currentNonStrikerId && wickets < 10) {
    activePartnership = {
      wicketNo: wickets + 1,
      player1Id: currentStrikerId,
      player1Name: battingMap.get(currentStrikerId)?.playerName || '',
      player1Runs: p1Runs,
      player1Balls: p1Balls,
      player2Id: currentNonStrikerId,
      player2Name: battingMap.get(currentNonStrikerId)?.playerName || '',
      player2Runs: p2Runs,
      player2Balls: p2Balls,
      totalRuns: currentPartRuns,
      totalBalls: currentPartBalls,
      isActive: true
    };
  }

  const crr = calculateCRR(runs, legalBalls);
  const maxLegalBalls = maxOvers * 6;
  const ballsRemaining = Math.max(0, maxLegalBalls - legalBalls);
  const rrr = target ? calculateRRR(target, runs, ballsRemaining) : undefined;

  const isOverEnded = legalBalls % 6 === 0 && legalBalls > 0;
  const isInningsEnded = wickets >= 10 || (maxOvers > 0 && legalBalls >= maxLegalBalls) || (target ? runs >= target : false);

  return {
    runs,
    wickets,
    legalBalls,
    oversDisplay: legalBallsToOvers(legalBalls),
    crr,
    rrr,
    ex_b,
    ex_lb,
    ex_wd,
    ex_nb,
    ex_p,
    battingScores: Array.from(battingMap.values()).sort((a, b) => a.battingOrder - b.battingOrder),
    bowlingFigures: Array.from(bowlingMap.values()).filter((bw) => bw.legalBalls > 0 || bw.isBowling),
    currentPartnership: activePartnership,
    partnerships,
    fallOfWickets,
    recentBalls: recentBallsList.slice(-18), // last ~2-3 overs
    strikerId: currentStrikerId,
    nonStrikerId: currentNonStrikerId,
    currentBowlerId,
    isOverEnded,
    isInningsEnded
  };
}
