import { createToken } from '@/fountain/FountainTokenHelper';

/**
 * @typedef {HEADING_1_STYLE|
 * HEADING_2_STYLE|
 * HEADING_3_STYLE|
 * HEADING_4_STYLE|
 * HEADING_5_STYLE|
 * HEADING_6_STYLE} FountainTokenHeadingStyle
 */

export const HEADING_TYPE = 'heading';
export const HEADING_1_STYLE = 'h1';
export const HEADING_2_STYLE = 'h2';
export const HEADING_3_STYLE = 'h3';
export const HEADING_4_STYLE = 'h4';
export const HEADING_5_STYLE = 'h5';
export const HEADING_6_STYLE = 'h6';

/** @type {Array<FountainTokenHeadingStyle>} */
export const HEADING_STYLES = [
  HEADING_1_STYLE,
  HEADING_2_STYLE,
  HEADING_3_STYLE,
  HEADING_4_STYLE,
  HEADING_5_STYLE,
  HEADING_6_STYLE,
];

const HEADING_PATTERN = /^(INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)\W/i;
const HEADING_FORCE_PATTERN = /^\.[\w\d]/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function HeadingToken(out, line) {
  if (!HEADING_PATTERN.test(line)) {
    return false;
  }
  // Start a new heading block
  out.push(createToken(HEADING_TYPE, line.trim(), false));
  return true;
}

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function HeadingTokenOverride(out, line) {
  if (!HEADING_FORCE_PATTERN.test(line)) {
    return false;
  }
  // Start a new heading block
  out.push(createToken(HEADING_TYPE, line.substring(1).trim(), true));
  return true;
}
