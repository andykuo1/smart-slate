import { expect, test } from 'vitest';

import {
  charToNum,
  formatProjectId,
  formatSceneNumber,
  formatShotNumber,
  formatTakeNumber,
  numToChar,
} from './TakeNameFormat';

test('converts A to 1', () => {
  expect(charToNum('A')).toBe(1);
});

test('converts Z to 26', () => {
  expect(charToNum('Z')).toBe(26);
});

test('converts AA to 27', () => {
  expect(charToNum('AA')).toBe(27);
});

test('converts <bad char> to 0', () => {
  expect(charToNum('.')).toBe(0);
  expect(charToNum('-')).toBe(0);
  expect(charToNum(' ')).toBe(0);
  expect(charToNum('')).toBe(0);
});

test('converts 1 to A', () => {
  expect(numToChar(1)).toBe('A');
});

test('converts 26 to Z', () => {
  expect(numToChar(26)).toBe('Z');
});

test('converts 27 to AA', () => {
  expect(numToChar(27)).toBe('AA');
});

test('converts <bad num> to -', () => {
  expect(numToChar(Number.NaN)).toBe('-');
  expect(numToChar(Number.POSITIVE_INFINITY)).toBe('-');
});

test('converts 1 to A and back', () => {
  expect(charToNum(numToChar(1))).toBe(1);
});

test('formatProjectId is correct', () => {
  expect(formatProjectId('')).toBe('UNTITLED');
  expect(formatProjectId('cowabunga')).toBe('COWABUNGA');
  expect(formatProjectId('cowabunga1234567890')).toBe('COWABUNGA1234567');
  expect(formatProjectId('cOwAbUnGa+_(woot)')).toBe('COWABUNGA_WOOT');
  expect(formatProjectId(' \r \n\t cow a bung a \n')).toBe('COWABUNGA');
  expect(formatProjectId(' \n\t\r  ')).toBe('UNTITLED');
  expect(formatProjectId(' +(!@#$%^&*) ')).toBe('UNTITLED');
});

test('formatSceneNumber is correct', () => {
  expect(formatSceneNumber(0, false)).toBe('00');
  expect(formatSceneNumber(-1, false)).toBe('00');
  expect(formatSceneNumber(1, false)).toBe('01');
  expect(formatSceneNumber(10, false)).toBe('10');
  expect(formatSceneNumber(99, false)).toBe('99');

  expect(formatSceneNumber(0, true)).toBe('0');
  expect(formatSceneNumber(-1, true)).toBe('0');
  expect(formatSceneNumber(1, true)).toBe('1');
  expect(formatSceneNumber(10, true)).toBe('10');
  expect(formatSceneNumber(99, true)).toBe('99');
});

test('formatShotNumber is correct', () => {
  expect(formatShotNumber(0)).toBe('Z');
  expect(formatShotNumber(-1)).toBe('Z');
  expect(formatShotNumber(1)).toBe('A');
  expect(formatShotNumber(10)).toBe('J');
  expect(formatShotNumber(26)).toBe('Z');
  expect(formatShotNumber(27)).toBe('AA');
  expect(formatShotNumber(51)).toBe('AY');
  expect(formatShotNumber(52)).toBe('AZ');
  expect(formatShotNumber(53)).toBe('BA');
  expect(formatShotNumber(99)).toBe('CU');
  expect(formatShotNumber(702)).toBe('ZZ');
  expect(formatShotNumber(703)).toBe('AAA');
});

test('formatTakeNumber is correct', () => {
  expect(formatTakeNumber(0, false)).toBe('--');
  expect(formatTakeNumber(-1, false)).toBe('--');
  expect(formatTakeNumber(1, false)).toBe('T01');
  expect(formatTakeNumber(10, false)).toBe('T10');
  expect(formatTakeNumber(99, false)).toBe('T99');

  expect(formatTakeNumber(0, true)).toBe('--');
  expect(formatTakeNumber(-1, true)).toBe('--');
  expect(formatTakeNumber(1, true)).toBe('1');
  expect(formatTakeNumber(10, true)).toBe('10');
  expect(formatTakeNumber(99, true)).toBe('99');
});

test('base-26 math is correct', () => {
  // Understanding number bases :P
  expect(9).toBe(9);
  expect(1 + 9).toBe(10);
  expect(10 * 10).toBe(100);
  expect(9 * 100 + 9 * 10 + 9).toBe(999);

  expect(formatShotNumber(26)).toBe('Z');
  expect(formatShotNumber(1 + 26)).toBe('AA');
  expect(formatShotNumber(27 * 27 - 26)).toBe('AAA');

  expect(formatShotNumber(1 + 26 + 26)).toBe('BA');
  expect(formatShotNumber(1 + 26 + 26 + 26)).toBe('CA');
  expect(formatShotNumber(1 + 26 * 26)).toBe('ZA');
  expect(formatShotNumber(26 + 26 * 26)).toBe('ZZ');
  expect(formatShotNumber(26 + 26 * 26 + 26 * 26 * 26)).toBe('ZZZ');

  expect(charToNum('A')).toBe(1);
  expect(charToNum('AA')).toBe(1 + 26);
  expect(charToNum('AAA')).toBe(1 + 26 + 26 * 26);

  expect(charToNum('B')).toBe(2);
  expect(charToNum('AB')).toBe(2 + 26);
  expect(charToNum('BB')).toBe(2 * (1 + 26));
  expect(charToNum('BBB')).toBe(2 * (1 + 26 + 26 * 26));

  expect(charToNum('Z')).toBe(26);
  expect(charToNum('ZZ')).toBe(26 * (1 + 26));
  expect(charToNum('ZZZ')).toBe(26 * (1 + 26 + 26 * 26));
  expect(charToNum('AAAA')).toBe(26 * (1 + 26 + 26 * 26) + 1);

  expect(charToNum('ZZ') % charToNum('AAA')).toBe(702);
  expect(numToChar(702)).toBe('ZZ');
  expect(charToNum('ZZ') - Math.floor(charToNum('ZZ') / charToNum('AAA'))).toBe(
    702,
  );

  expect(Math.floor(charToNum('ZZA') / charToNum('AAA'))).toBe(25);
  expect(numToChar(25)).toBe('Y');
  expect(charToNum('ZZA') - 25 * charToNum('AAA') - 1).toBe(677);
  expect(numToChar(677)).toBe('ZA');

  expect(Math.floor(charToNum('ABC') / charToNum('AAA'))).toBe(1);
  expect(charToNum('ABC') - 1 * charToNum('AAA') - 1).toBe(27);
  // TODO: BC != 27
  expect('BC').toBe(numToChar(55));
});
