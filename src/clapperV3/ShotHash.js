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
