import { createToken } from '@/fountain/FountainTokenHelper';

import { PAGE_BREAK_TYPE } from './PageBreakToken';

/**
 * @typedef {TITLE_TITLE_STYLE|
 * TITLE_CREDIT_STYLE|
 * TITLE_AUTHOR_STYLE|
 * TITLE_SOURCE_STYLE|
 * TITLE_CONTACT_STYLE|
 * TITLE_DRAFT_DATE_STYLE} FountainTokenFrontMatterStyle
 */

export const FRONT_MATTER_TYPE = 'front-matter';
export const TITLE_TITLE_STYLE = 'Title';
export const TITLE_CREDIT_STYLE = 'Credit';
export const TITLE_AUTHOR_STYLE = 'Author';
export const TITLE_SOURCE_STYLE = 'Source';
export const TITLE_CONTACT_STYLE = 'Contact';
export const TITLE_DRAFT_DATE_STYLE = 'Draft date';

/** @type {Array<FountainTokenFrontMatterStyle>} */
export const FRONT_MATTER_STYLES = [
  TITLE_TITLE_STYLE,
  TITLE_CREDIT_STYLE,
  TITLE_AUTHOR_STYLE,
  TITLE_SOURCE_STYLE,
  TITLE_CONTACT_STYLE,
  TITLE_DRAFT_DATE_STYLE,
];

const FRONT_MATTER_DELIMITER = ':';
const FRONT_MATTER_VALUE_PATTERN = /^\s+/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function FrontMatterToken(out, line) {
  if (out.pageType !== 'front-matter') {
    return false;
  }

  // NOTE: Consumes all content while in a front-matter page.

  const emptyLine = line.trim().length <= 0;
  let prev = out.peek();
  if (!prev && emptyLine) {
    // ...newlines before front matter. Skip it :)
    return true;
  }

  function exitFrontMatter() {
    out.pageType = 'screenplay';
    // NOTE: "A page break is implicit after the Title Page"
    //  ...so here it is...
    out.push(createToken(PAGE_BREAK_TYPE, '', false));
  }

  let k = line.indexOf(FRONT_MATTER_DELIMITER);
  // ...maybe this is a front matter key?
  if (k >= 0) {
    let key = line.substring(0, k).trim();
    let value = line.substring(k + 1).trim();
    out.push(
      createFrontMatterToken(
        /** @type {FountainTokenFrontMatterStyle} */ (key),
        value,
      ),
    );
  }
  // ...or this is a continued front matter value.
  else if (FRONT_MATTER_VALUE_PATTERN.test(line)) {
    if (!prev) {
      // Not a valid front matter value, so let's skip to normal processing.
      exitFrontMatter();
      return false;
    }
    if (prev.text.length > 0) {
      prev.text += '\n';
    }
    prev.text += line.trim();
    //...and continue processing front matter.
  } else {
    // ...an empty line! We should expect no more front matter!
    exitFrontMatter();
    if (!emptyLine) {
      // ...not valid front matter! Let's actually process this line now.
      return false;
    } else {
      // ...valid end of the front matter! Skip the empty line and start!
      return true;
    }
  }
  return true;
}

/**
 * @param {FountainTokenFrontMatterStyle} key
 * @param {string} value
 */
function createFrontMatterToken(key, value) {
  const frontMatterStyle = /** @type {FountainTokenFrontMatterStyle} */ (key);
  return createToken(FRONT_MATTER_TYPE, value, true, frontMatterStyle);
}
