const BYTE_UNITS = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
const BYTE_ORDER_MAGNITUDE = 1_000;

/** @param {number} bytes */
export function formatBytes(bytes, minimum = 0) {
  for (let unit of BYTE_UNITS) {
    if (minimum > 0) {
      --minimum;
      bytes /= BYTE_ORDER_MAGNITUDE;
      continue;
    }
    if (bytes < BYTE_ORDER_MAGNITUDE) {
      return `${bytes.toFixed(2)} ${unit}`;
    }
    bytes /= BYTE_ORDER_MAGNITUDE;
  }
  return `${(bytes * BYTE_ORDER_MAGNITUDE).toFixed(2)} ${
    BYTE_UNITS[BYTE_UNITS.length - 1]
  }`;
}

/**
 * @param {number} millis
 */
export function formatHourMinSecTime(millis) {
  const seconds = Math.floor((millis / 1000) % 60);
  const minutes = Math.floor((millis / (1000 * 60)) % 60);
  const hours = Math.floor((millis / (1000 * 60 * 60)) % 24);
  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0')
  );
}
