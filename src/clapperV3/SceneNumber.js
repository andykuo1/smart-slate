/**
 * @param {any} [value]
 */
export default function SceneNumber(value) {
  let result;
  if (typeof value === 'string') {
    result = SceneNumber.parse(value);
  } else {
    result = SceneNumber.sanitize(value);
  }
  return SceneNumber.stringify(result);
}

SceneNumber.NULL_VALUE = 0;
SceneNumber.MIN_VALUE = 1;
SceneNumber.MAX_VALUE = 999;

SceneNumber.NULL_STRING = '000';
SceneNumber.MIN_STRING = '001';
SceneNumber.MAX_STRING = '999';

/** @param {string} text */
SceneNumber.parse = function parse(text) {
  if (typeof text !== 'string') {
    return 0;
  }
  if (text.length > 3) {
    text = text.substring(text.length - 3);
  }
  let result = Number(text);
  result = SceneNumber.sanitize(result);
  return result;
};

/** @param {number} num */
SceneNumber.stringify = function stringify(num) {
  num = SceneNumber.sanitize(num);
  if (num <= 0) {
    return SceneNumber.NULL_STRING;
  }
  return String(num).padStart(3, '0');
};

/** @param {number} num */
SceneNumber.sanitize = function sanitize(num) {
  if (!Number.isFinite(num)) {
    if (num > 0) {
      return SceneNumber.MAX_VALUE;
    }
    return 0;
  }
  if (num > SceneNumber.MAX_VALUE) {
    // Force non-zero values if beyond max range.
    num = ((num - (SceneNumber.MAX_VALUE + 1)) % SceneNumber.MAX_VALUE) + 1;
  }
  if (num <= 0) {
    return 0;
  }
  return num;
};

/**
 * @param {number} num
 */
SceneNumber.isEmpty = function isEmpty(num) {
  return !(num >= SceneNumber.MIN_VALUE && num <= SceneNumber.MAX_VALUE);
};
