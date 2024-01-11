/**
 * @typedef {ReturnType<create>} Color
 */

export function create() {
  return 0x0;
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 */
export function fromValues(r, g, b, a = 0xff) {
  return (
    ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff)
  );
}

/**
 * @param {number} redf
 * @param {number} greenf
 * @param {number} bluef
 * @param {number} alphaf
 */
export function fromFloats(redf, greenf, bluef, alphaf = 1.0) {
  let r = Math.floor(Math.max(Math.min(redf, 1), 0) * 255);
  let g = Math.floor(Math.max(Math.min(greenf, 1), 0) * 255);
  let b = Math.floor(Math.max(Math.min(bluef, 1), 0) * 255);
  let a = Math.floor(Math.max(Math.min(alphaf, 1), 0) * 255);
  return fromValues(r, g, b, a);
}

/**
 * @param {Color} hexValue
 */
export function red(hexValue) {
  return (hexValue >> 16) & 0xff;
}

/**
 * @param {Color} hexValue
 */
export function redf(hexValue) {
  return ((hexValue >> 16) & 0xff) / 255.0;
}

/**
 * @param {Color} hexValue
 */
export function green(hexValue) {
  return (hexValue >> 8) & 0xff;
}

/**
 * @param {Color} hexValue
 */
export function greenf(hexValue) {
  return ((hexValue >> 8) & 0xff) / 255.0;
}

/**
 * @param {Color} hexValue
 */
export function blue(hexValue) {
  return hexValue & 0xff;
}

/**
 * @param {Color} hexValue
 */
export function bluef(hexValue) {
  return (hexValue & 0xff) / 255.0;
}

/**
 * @param {Color} hexValue
 */
export function alpha(hexValue) {
  let result = (hexValue >> 24) & 0xff;
  if (result === 0x00) {
    return 0xff;
  }
  return result;
}

/**
 * @param {Color} hexValue
 */
export function alphaf(hexValue) {
  return alpha(hexValue) / 255.0;
}

const OPACITY_EPSILON = 0.01;

/**
 * @param {Color} from
 * @param {Color} to
 * @param {number} delta
 */
export function mix(from = 0x000000, to = 0xffffff, delta = 0.5) {
  const rm = redf(from);
  const gm = greenf(from);
  const bm = bluef(from);
  const am = alphaf(from);
  const rf = (redf(to) - rm) * delta + rm;
  const gf = (greenf(to) - gm) * delta + gm;
  const bf = (bluef(to) - bm) * delta + bm;
  /** @type {number|undefined} */
  let af = (alphaf(to) - am) * delta + am;
  if (af < OPACITY_EPSILON) {
    af = undefined;
  }
  return fromFloats(rf, gf, bf, af);
}

/**
 * @param {Color} hexValue
 */
export function toCSSColorString(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  let r = red(hexValue).toString(16).padStart(2, '0');
  let g = green(hexValue).toString(16).padStart(2, '0');
  let b = blue(hexValue).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/**
 * @param {Color} hexValue
 */
export function toFloatVector(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  return [redf(hexValue), greenf(hexValue), bluef(hexValue), alphaf(hexValue)];
}
