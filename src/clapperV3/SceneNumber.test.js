import { expect, test } from 'vitest';

import SceneNumber from './SceneNumber';

test('SceneNumber() returns valid numbers', () => {
  expect(SceneNumber.sanitize(0)).toBe(0);
  expect(SceneNumber.sanitize(10)).toBe(10);
  expect(SceneNumber.sanitize(999)).toBe(999);
  expect(SceneNumber.sanitize(1000)).toBe(1);
  expect(SceneNumber.sanitize(1234)).toBe(235);
  expect(SceneNumber.sanitize(1998)).toBe(999);
  expect(SceneNumber.sanitize(1999)).toBe(1);
  expect(SceneNumber.sanitize(-1)).toBe(0);
  expect(SceneNumber.sanitize(-1234)).toBe(0);
  expect(SceneNumber.sanitize(Number(''))).toBe(0);
  expect(SceneNumber.sanitize(Number('a'))).toBe(0);
  expect(SceneNumber.sanitize(Number.NaN)).toBe(0);
  expect(SceneNumber.sanitize(Number.NEGATIVE_INFINITY)).toBe(0);
  expect(SceneNumber.sanitize(Number.POSITIVE_INFINITY)).toBe(999);
  // @ts-expect-error This is not an expected type.
  expect(SceneNumber.sanitize('a')).toBe(0);
  // @ts-expect-error This is not an expected type.
  expect(SceneNumber.sanitize({ test: 'test' })).toBe(0);
  // @ts-expect-error This is not an expected type.
  expect(SceneNumber.sanitize(undefined)).toBe(0);
  // @ts-expect-error This is not an expected type.
  expect(SceneNumber.sanitize(null)).toBe(0);
});
