import { createToken } from '@/fountain/FountainTokenHelper';

export const SECTION_TYPE = 'section';

const SECTION_FORCE_PATTERN = /^#+/;
const SECTION_CAPTURE_PATTERN = /^(#+)(.*)$/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function SectionToken(out, line) {
  if (!SECTION_FORCE_PATTERN.test(line)) {
    return false;
  }

  // Start a new section block
  let [_, level, section] = SECTION_CAPTURE_PATTERN.exec(line) || [];
  out.push(createSectionToken(section.trim(), level.length));
  return true;
}

/**
 * @param {string} title
 * @param {number} level
 */
function createSectionToken(title, level) {
  const headingStyle =
    /** @type {import('@/fountain/tokens/HeadingToken').FountainTokenHeadingStyle} */ (
      `h${level}`
    );
  return createToken(SECTION_TYPE, title, true, headingStyle);
}
