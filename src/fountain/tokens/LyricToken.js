import { createToken } from '@/fountain/FountainTokenHelper';

export const LYRIC_TYPE = 'lyric';

const LYRIC_FORCE_PATTERN = /^~/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function LyricTokenOverride(out, line) {
  if (!LYRIC_FORCE_PATTERN.test(line)) {
    return false;
  }
  // Start a new lyric block
  out.push(createToken(LYRIC_TYPE, line.substring(1).trim(), true));
  return true;
}
