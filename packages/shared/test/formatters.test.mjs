import test from 'node:test';
import assert from 'node:assert/strict';

import {
  legalBallsToOvers,
  calculateCRR,
  calculateRRR,
  calculateStrikeRate,
  calculateEconomy,
  calculateNRR
} from '../src/formatters.ts';

test('formatters: legalBallsToOvers', () => {
  assert.equal(legalBallsToOvers(0), '0.0');
  assert.equal(legalBallsToOvers(1), '0.1');
  assert.equal(legalBallsToOvers(6), '1.0');
  assert.equal(legalBallsToOvers(98), '16.2');
  assert.equal(legalBallsToOvers(120), '20.0');
});

test('formatters: calculateCRR', () => {
  const crr = calculateCRR(145, 98);
  assert.equal(crr, 8.88);
});

test('formatters: calculateRRR', () => {
  const rrr = calculateRRR(187, 145, 22);
  assert.equal(rrr, 11.45);
});

test('formatters: calculateStrikeRate', () => {
  const sr = calculateStrikeRate(34, 18);
  assert.equal(sr, 188.89);
});

test('formatters: calculateEconomy', () => {
  const econ = calculateEconomy(22, 20);
  assert.equal(econ, 6.6);
});

test('formatters: calculateNRR', () => {
  const nrr = calculateNRR(382, 40, 310, 40);
  assert.equal(nrr, 1.8);
});
