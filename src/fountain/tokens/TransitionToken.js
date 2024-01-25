import { createToken } from '@/fountain/FountainTokenHelper';

export const TRANSITION_TYPE = 'transition';

const TRANSITION_PATTERN = /^\s*(?=.+[A-Z])[A-Z\d\s\W]+TO:$/;
const TRANSITION_FORCE_PATTERN = /^>/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function TransitionToken(out, line) {
  if (!TRANSITION_PATTERN.test(line)) {
    return false;
  }
  // Start a new transition block
  out.push(createToken(TRANSITION_TYPE, line.trim(), false));
  return true;
}

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function TransitionTokenOverride(out, line) {
  if (!TRANSITION_FORCE_PATTERN.test(line)) {
    return false;
  }

  // Start a new transition block
  out.push(createToken(TRANSITION_TYPE, line.substring(1).trim(), true));
  return true;
}
