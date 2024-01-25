import { createToken } from '@/fountain/FountainTokenHelper';

export const PAGE_BREAK_TYPE = 'page-break';

const PAGE_BREAK_FORCE_PATTERN = /^\s*(===+|---+)\s*$/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function PageBreakToken(out, line) {
  if (!PAGE_BREAK_FORCE_PATTERN.test(line)) {
    return false;
  }

  // Collapse all sequential page-breaks (usually from front-matter)
  let prev = out.peek();
  if (prev && prev.type === 'page-break' && !prev.forced) {
    // ...so collapse it.
    prev.text = line;
    prev.forced = true;
    return true;
  }

  // Start a new page break block
  out.push(createToken(PAGE_BREAK_TYPE, '', true));
  return true;
}
