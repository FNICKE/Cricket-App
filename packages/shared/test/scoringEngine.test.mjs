import test from 'node:test';
import assert from 'node:assert/strict';

import { recomputeInningsFromBalls } from '../src/scoringEngine.ts';

test('scoringEngine: processes normal runs, boundaries, dots and strike rotation', () => {
  const batters = [
    { id: 1, name: 'Virat Kohli' },
    { id: 2, name: 'Rohit Sharma' },
    { id: 3, name: 'Suryakumar Yadav' }
  ];
  const bowlers = [
    { id: 7, name: 'Jasprit Bumrah' },
    { id: 8, name: 'Mitchell Starc' }
  ];

  // Ball 1: Kohli takes a single -> strike rotates to Rohit
  // Ball 2: Rohit hits a 4 -> stays on strike
  // Ball 3: Rohit takes 2 -> stays on strike
  // Ball 4: Rohit hits a 6 -> stays on strike
  // Ball 5: Rohit dot ball -> stays on strike
  // Ball 6: Rohit takes a single (legal ball 6 -> over ends, batters swap ends again!)
  const balls = [
    {
      id: 1,
      inningsId: 1,
      seq: 1,
      overNo: 0,
      ballInOver: 1,
      bowlerId: 8,
      strikerId: 1,
      nonStrikerId: 2,
      runsBat: 1,
      isLegal: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      inningsId: 1,
      seq: 2,
      overNo: 0,
      ballInOver: 2,
      bowlerId: 8,
      strikerId: 2,
      nonStrikerId: 1,
      runsBat: 4,
      isLegal: true,
      isFour: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      inningsId: 1,
      seq: 3,
      overNo: 0,
      ballInOver: 3,
      bowlerId: 8,
      strikerId: 2,
      nonStrikerId: 1,
      runsBat: 2,
      isLegal: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      inningsId: 1,
      seq: 4,
      overNo: 0,
      ballInOver: 4,
      bowlerId: 8,
      strikerId: 2,
      nonStrikerId: 1,
      runsBat: 6,
      isLegal: true,
      isSix: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      inningsId: 1,
      seq: 5,
      overNo: 0,
      ballInOver: 5,
      bowlerId: 8,
      strikerId: 2,
      nonStrikerId: 1,
      runsBat: 0,
      isLegal: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      inningsId: 1,
      seq: 6,
      overNo: 0,
      ballInOver: 6,
      bowlerId: 8,
      strikerId: 2,
      nonStrikerId: 1,
      runsBat: 1,
      isLegal: true,
      createdAt: new Date().toISOString()
    }
  ];

  const result = recomputeInningsFromBalls({
    matchId: 1,
    inningsNo: 1,
    maxOvers: 20,
    balls,
    allBatters: batters,
    allBowlers: bowlers,
    initialStrikerId: 1,
    initialNonStrikerId: 2,
    initialBowlerId: 8
  });

  // Total runs: 1 + 4 + 2 + 6 + 0 + 1 = 14 runs
  assert.equal(result.runs, 14);
  assert.equal(result.wickets, 0);
  assert.equal(result.legalBalls, 6);
  assert.equal(result.oversDisplay, '1.0');
  assert.equal(result.isOverEnded, true);

  // Check Kohli stats: 1 run off 1 ball
  const kohli = result.battingScores.find((b) => b.playerId === 1);
  assert.equal(kohli?.runs, 1);
  assert.equal(kohli?.balls, 1);

  // Check Rohit stats: 4+2+6+0+1 = 13 runs off 5 balls, 1 four, 1 six
  const rohit = result.battingScores.find((b) => b.playerId === 2);
  assert.equal(rohit?.runs, 13);
  assert.equal(rohit?.balls, 5);
  assert.equal(rohit?.fours, 1);
  assert.equal(rohit?.sixes, 1);

  // Bowler Starc stats: 1.0 over, 14 runs, 0 wickets
  const starc = result.bowlingFigures.find((bw) => bw.playerId === 8);
  assert.equal(starc?.oversDisplay, '1.0');
  assert.equal(starc?.runs, 14);
  assert.equal(starc?.wickets, 0);
});

test('scoringEngine: handles wide ball (extra run, does not increment legal ball)', () => {
  const batters = [
    { id: 1, name: 'Virat Kohli' },
    { id: 2, name: 'Rohit Sharma' }
  ];
  const bowlers = [{ id: 8, name: 'Mitchell Starc' }];

  const balls = [
    {
      id: 1,
      inningsId: 1,
      seq: 1,
      overNo: 0,
      ballInOver: 0,
      bowlerId: 8,
      strikerId: 1,
      nonStrikerId: 2,
      runsBat: 0,
      extraType: 'wd',
      extraRuns: 0,
      isLegal: false,
      createdAt: new Date().toISOString()
    }
  ];

  const result = recomputeInningsFromBalls({
    matchId: 1,
    inningsNo: 1,
    balls,
    allBatters: batters,
    allBowlers: bowlers,
    initialStrikerId: 1,
    initialNonStrikerId: 2,
    initialBowlerId: 8
  });

  assert.equal(result.runs, 1);
  assert.equal(result.legalBalls, 0);
  assert.equal(result.oversDisplay, '0.0');
  assert.equal(result.ex_wd, 1);

  // Striker still hasn't faced a legal ball
  const kohli = result.battingScores.find((b) => b.playerId === 1);
  assert.equal(kohli?.balls, 0);
  assert.equal(kohli?.runs, 0);
});
