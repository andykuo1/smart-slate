import { createToken } from '@/fountain/FountainTokenHelper';

/**
 * @typedef {UNKNOWN_STYLE} FountainTokenUnknownStyle
 */

export const UNKNOWN_TYPE = 'unknown';
export const UNKNOWN_STYLE = '';
/** @type {Array<FountainTokenUnknownStyle>} */
export const UNKNOWN_STYLES = [UNKNOWN_STYLE];

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function UnknownToken(out, line) {
  if (line.length <= 0) {
    return false;
  }
  // There's expected continued content, but it's not handled!
  out.push(createToken(UNKNOWN_TYPE, line, false));
  return true;
}
