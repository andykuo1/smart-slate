import { expect, test } from 'vitest';

import ShotNumber from './ShotNumber';

test('ShotNumber() returns valid numbers', () => {
  expect(ShotNumber.sanitize(0)).toBe(0);
  expect(ShotNumber.sanitize(27)).toBe(27);
  expect(ShotNumber.sanitize(702)).toBe(702);
  expect(ShotNumber.sanitize(703)).toBe(1);
  expect(ShotNumber.sanitize(1404)).toBe(702);
  expect(ShotNumber.sanitize(1405)).toBe(1);
  expect(ShotNumber.sanitize(-1)).toBe(0);
  expect(ShotNumber.sanitize(-1234)).toBe(0);
  expect(ShotNumber.sanitize(Number(''))).toBe(0);
  expect(ShotNumber.sanitize(Number('a'))).toBe(0);
  expect(ShotNumber.sanitize(Number.NaN)).toBe(0);
  expect(ShotNumber.sanitize(Number.NEGATIVE_INFINITY)).toBe(0);
  expect(ShotNumber.sanitize(Number.POSITIVE_INFINITY)).toBe(702);
  // @ts-expect-error This is not an expected type.
  expect(ShotNumber.sanitize('a')).toBe(0);
  // @ts-expect-error This is not an expected type.
  expect(ShotNumber.sanitize({ test: 'test' })).toBe(0);
  // @ts-expect-error This is not an expected type.
  expect(ShotNumber.sanitize(undefined)).toBe(0);
  // @ts-expect-error This is not an expected type.
  expect(ShotNumber.sanitize(null)).toBe(0);
});
