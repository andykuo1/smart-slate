import { expect, test } from 'vitest';

import ShotHash from './ShotHash';

test('ShotHash() returns valid numbers', () => {
  expect(ShotHash('1234')).toBe('1234');
  expect(ShotHash('0000')).toBe('0000');
  expect(ShotHash('----')).toBe('----');
  expect(ShotHash('12345')).toBe('2345');
  expect(ShotHash('99999')).toBe('9999');
  expect(ShotHash('123')).toBe('0123');
  expect(ShotHash('1')).toBe('0001');
  expect(ShotHash('0')).toBe('0000');
  expect(ShotHash('')).toBe('----');
  expect(ShotHash('asdf')).toBe('----');
  expect(ShotHash('ASDF')).toBe('----');
  expect(ShotHash('0x123')).toBe('----');

  // number types
  expect(ShotHash(0)).toBe('0000');
  expect(ShotHash(1)).toBe('0001');
  expect(ShotHash(1234)).toBe('1234');
  expect(ShotHash(9999)).toBe('9999');
  expect(ShotHash(10_000)).toBe('0000');
  expect(ShotHash(19_999)).toBe('9999');
  expect(ShotHash(20_000)).toBe('0000');

  // Negatives don't matter.
  expect(ShotHash(-1)).toBe('0001');
  expect(ShotHash(-1234)).toBe('1234');

  // Mixed dashes and numbers.
  expect(ShotHash('--11')).toBe('0011');
  expect(ShotHash('1---')).toBe('1000');

  // Other types
  expect(ShotHash(Number(''))).toBe('0000');
  expect(ShotHash(Number('a'))).toBe('----');
  expect(ShotHash(Number.NaN)).toBe('----');
  expect(ShotHash(Number.NEGATIVE_INFINITY)).toBe('----');
  expect(ShotHash(Number.POSITIVE_INFINITY)).toBe('----');
  expect(ShotHash('a')).toBe('----');
  expect(ShotHash({ test: 'test' })).toBe('----');
  expect(ShotHash(undefined)).toBe('----');
  expect(ShotHash(null)).toBe('----');
});
