import { createToken } from '@/fountain/FountainTokenHelper';

export const SYNOPSIS_TYPE = 'synopsis';

const SYNOPSIS_FORCE_PATTERN = /^=/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function SynopsisToken(out, line) {
  if (!SYNOPSIS_FORCE_PATTERN.test(line)) {
    return false;
  }

  // Start a new synopsis block
  out.push(createToken(SYNOPSIS_TYPE, line.substring(1).trim(), true));
  return true;
}
