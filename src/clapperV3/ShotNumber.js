import { charToNum, numToChar } from '@/components/takes/TakeNameFormat';

/** @param {any} [value] */
export default function ShotNumber(value) {
  let result;
  if (typeof value === 'string') {
    result = ShotNumber.parse(value);
  } else {
    result = ShotNumber.sanitize(value);
  }
  return ShotNumber.stringify(result);
}

ShotNumber.NULL_VALUE = 0;
ShotNumber.MIN_VALUE = 1;
ShotNumber.MAX_VALUE = charToNum('ZZ');

ShotNumber.NULL_STRING = '';
ShotNumber.MIN_STRING = 'A';
ShotNumber.MAX_STRING = 'ZZ';

/** @param {string} text */
ShotNumber.parse = function parse(text) {
  if (typeof text !== 'string') {
    return 0;
  }
  if (text.length > 2) {
    text = text.substring(text.length - 2);
  }
  text = text.toUpperCase();
  let result = charToNum(text);
  result = ShotNumber.sanitize(result);
  return result;
};

/** @param {number} num */
ShotNumber.stringify = function stringify(num) {
  num = ShotNumber.sanitize(num);
  if (num <= 0) {
    return ShotNumber.NULL_STRING;
  }
  return numToChar(num);
};

/** @param {number} num */
ShotNumber.sanitize = function sanitize(num) {
  if (!Number.isFinite(num)) {
    if (num > 0) {
      return ShotNumber.MAX_VALUE;
    }
    return 0;
  }
  if (num > ShotNumber.MAX_VALUE) {
    // Force non-zero values if beyond max range.
    num = ((num - (ShotNumber.MAX_VALUE + 1)) % ShotNumber.MAX_VALUE) + 1;
  }
  if (num <= 0) {
    return 0;
  }
  return num;
};

/**
 * @param {number} num
 */
ShotNumber.isEmpty = function isEmpty(num) {
  return !(num >= ShotNumber.MIN_VALUE && num <= ShotNumber.MAX_VALUE);
};
