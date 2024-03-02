/** @param {any} [value] */
export default function ShotHash(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return ShotHash.NULL_VALUE;
    }
    return String(Math.abs(value) % 10_000).padStart(4, '0');
  }
  if (!value) {
    return ShotHash.NULL_VALUE;
  }
  let result = String(value);
  if (result.length > 4) {
    result = result.substring(result.length - 4);
  }
  result = result.toUpperCase();
  if (result === ShotHash.NULL_VALUE) {
    return ShotHash.NULL_VALUE;
  }
  result = result.replace(/-/g, '0');
  if (Number(result) >= 0) {
    return String(result).padStart(4, '0');
  }
  return ShotHash.NULL_VALUE;
}

ShotHash.NULL_VALUE = '----';
ShotHash.MIN_VALUE = '0000';
ShotHash.MAX_VALUE = '9999';

const MAX_GENERATED_NUMBER = 9999;

ShotHash.generate = function generate(exclude = []) {
  if (exclude.length >= MAX_GENERATED_NUMBER) {
    throw new Error('Out of available shot hashes - exclude list too long.');
  }
  let hash = Math.floor(Math.random() * MAX_GENERATED_NUMBER) + 1;
  let result = ShotHash(hash);
  let excluded = exclude.includes(result);
  if (!excluded) {
    return result;
  }

  for (let attempts = 1; attempts < MAX_GENERATED_NUMBER; ++attempts) {
    // Find the next non-excluded shot hash...
    hash += 1;
    hash = hash % (MAX_GENERATED_NUMBER + 1);
    if (hash <= 0) {
      hash = 1;
    }

    result = ShotHash(hash);
    excluded = exclude.includes(result);
    if (!excluded) {
      return result;
    }
  }

  throw new Error('Out of available shot hashes - tried too many numbers.');
};
