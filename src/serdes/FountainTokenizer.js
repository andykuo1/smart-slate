/**
 * @typedef {ReturnType<createToken>} FountainToken
 */

/**
 * @typedef {FRONT_MATTER_TYPE|
 * HEADING_TYPE|
 * ACTION_TYPE|
 * COMMENT_TYPE|
 * NOTE_TYPE|
 * PAGE_BREAK_TYPE|
 * CHARACTER_TYPE|
 * LYRIC_TYPE|
 * TRANSITION_TYPE|
 * PARENTHETICAL_TYPE|
 * DIALOGUE_TYPE|
 * SECTION_TYPE|
 * SYNOPSIS_TYPE|
 * UNKNOWN_TYPE} FountainTokenType
 */

/**
 * @typedef {HEADING_1_STYLE|
 * HEADING_2_STYLE|
 * HEADING_3_STYLE|
 * HEADING_4_STYLE|
 * HEADING_5_STYLE|
 * HEADING_6_STYLE} FountainTokenHeadingStyle
 */

/**
 * @typedef {TITLE_TITLE_STYLE|
 * TITLE_CREDIT_STYLE|
 * TITLE_AUTHOR_STYLE|
 * TITLE_SOURCE_STYLE|
 * TITLE_CONTACT_STYLE|
 * TITLE_DRAFT_DATE_STYLE} FountainTokenFrontMatterStyle
 */

/**
 * @typedef {CHARACTER_SIMULTANEOUS_STYLE} FountainTokenCharacterStyle
 */

/**
 * @typedef {ACTION_CENTERED_STYLE} FountainTokenActionStyle
 */

/**
 * @typedef {UNKNOWN_STYLE} FountainTokenUnknownStyle
 */

/**
 * @typedef {FountainTokenUnknownStyle|
 * FountainTokenActionStyle|
 * FountainTokenCharacterStyle|
 * FountainTokenHeadingStyle|
 * FountainTokenFrontMatterStyle} FountainTokenStyle
 */

const FRONT_MATTER_TYPE = 'front-matter';
const HEADING_TYPE = 'heading';
const ACTION_TYPE = 'action';
const COMMENT_TYPE = 'comment';
const NOTE_TYPE = 'note';
const PAGE_BREAK_TYPE = 'page-break';
const CHARACTER_TYPE = 'character';
const LYRIC_TYPE = 'lyric';
const TRANSITION_TYPE = 'transition';
const PARENTHETICAL_TYPE = 'parenthetical';
const DIALOGUE_TYPE = 'dialogue';
const SECTION_TYPE = 'section';
const SYNOPSIS_TYPE = 'synopsis';
const UNKNOWN_TYPE = 'unknown';
export const FOUNTAIN_TOKEN_TYPES = [
  FRONT_MATTER_TYPE,
  HEADING_TYPE,
  ACTION_TYPE,
  COMMENT_TYPE,
  NOTE_TYPE,
  PAGE_BREAK_TYPE,
  CHARACTER_TYPE,
  LYRIC_TYPE,
  TRANSITION_TYPE,
  PARENTHETICAL_TYPE,
  DIALOGUE_TYPE,
  SECTION_TYPE,
  SYNOPSIS_TYPE,
  UNKNOWN_TYPE,
];

const UNKNOWN_STYLE = '';
const CHARACTER_SIMULTANEOUS_STYLE = 'simultaneous';
const ACTION_CENTERED_STYLE = 'centered';
const HEADING_1_STYLE = 'h1';
const HEADING_2_STYLE = 'h2';
const HEADING_3_STYLE = 'h3';
const HEADING_4_STYLE = 'h4';
const HEADING_5_STYLE = 'h5';
const HEADING_6_STYLE = 'h6';
const TITLE_TITLE_STYLE = 'Title';
const TITLE_CREDIT_STYLE = 'Credit';
const TITLE_AUTHOR_STYLE = 'Author';
const TITLE_SOURCE_STYLE = 'Source';
const TITLE_CONTACT_STYLE = 'Contact';
const TITLE_DRAFT_DATE_STYLE = 'Draft date';
/** @type {Array<FountainTokenStyle>} */
export const FOUNTAIN_TOKEN_STYLES = [
  UNKNOWN_STYLE,
  CHARACTER_SIMULTANEOUS_STYLE,
  ACTION_CENTERED_STYLE,
  HEADING_1_STYLE,
  HEADING_2_STYLE,
  HEADING_3_STYLE,
  HEADING_4_STYLE,
  HEADING_5_STYLE,
  HEADING_6_STYLE,
  TITLE_TITLE_STYLE,
  TITLE_CREDIT_STYLE,
  TITLE_AUTHOR_STYLE,
  TITLE_SOURCE_STYLE,
  TITLE_CONTACT_STYLE,
  TITLE_DRAFT_DATE_STYLE,
];

const HEADING_FORCE_PATTERN = /^\.[\w\d]/;
const ACTION_FORCE_PATTERN = /^\!/;
const CHARACTER_FORCE_PATTERN = /^@/;
const CHARACTER_SIMULTANEOUS_FORCE_PATTERN = /\^$/;
const LYRIC_FORCE_PATTERN = /^~/;
const ACTION_CENTERED_FORCE_PATTERN = /^>\s*.+\s*<$/;
const TRANSITION_FORCE_PATTERN = /^>/;
const PAGE_BREAK_FORCE_PATTERN = /^\s*===\s*$/;
const SECTION_FORCE_PATTERN = /^#+/;
const SYNOPSIS_FORCE_PATTERN = /^=/;

const HEADING_PATTERN = /^(INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)/i;
const CHARACTER_PATTERN = /^\s*(?=[A-Z])[A-Z\d\s\W]+(\(.+\))*\s*$/;
const PARENTHETICAL_PATTERN = /^\s*\(.*\)\s*$/;
const TRANSITION_PATTERN = /^\s*(?=.+[A-Z])[A-Z\d\s\W]+TO:$/;
const FRONT_MATTER_VALUE_PATTERN = /^\s+/;

const SECTION_CAPTURE_PATTERN = /^(#+)(.*)$/;

const FRONT_MATTER_DELIMITER = ':';
const LINE_COMMENT = '//';

const BLOCK_COMMENT_START = '/*';
const BLOCK_COMMENT_END = '*/';
const BLOCK_COMMENT_START_LENGTH = 2;
const BLOCK_COMMENT_END_LENGTH = 2;

const NOTE_START = '[[';
const NOTE_END = ']]';
const NOTE_START_LENGTH = 2;
const NOTE_END_LENGTH = 2;

/**
 * @param {string} text
 */
export function tokenize(text) {
  let result = [];

  // For continued content.
  /** @type {FountainToken|null} */
  let prevToken = null;

  // For notes.
  let notes = [];
  let findingNotes = false;
  let textBeforeNotes = '';

  // For frontmatter.
  let frontMatterKey = /** @type {FountainTokenFrontMatterStyle|''} */ ('');
  let frontMatterValue = '';
  let findingFrontMatter = true;

  // Split by newlines
  const lines = text.split('\n');
  const lineCount = lines.length;
  for (let lineIndex = 0; lineIndex < lineCount; ++lineIndex) {
    let line = lines[lineIndex];
    /** @type {FountainToken|null} */
    let currentToken = null;

    // == Check for traps!...
    // ...strip block/boneyard comments to 1 whitespace
    let i = line.indexOf(BLOCK_COMMENT_START);
    if (i >= 0) {
      let comments = [];
      let textBeforeComment = line.substring(0, i);
      let j = line.indexOf(BLOCK_COMMENT_END, i + BLOCK_COMMENT_START_LENGTH);
      while (j < 0) {
        comments.push(line.substring(i));
        // ...advance to newline...
        lineIndex++;
        if (lineIndex >= lineCount) {
          // ...the rest of the lines are part of the
          // un-closed block comment, so let's just
          // finish whatever we have now.
          i = 0;
          j = line.length;
          break;
        }
        line = lines[lineIndex];
        i = 0;
        j = line.indexOf(BLOCK_COMMENT_END);
      }
      let remainder = line.substring(i, j + BLOCK_COMMENT_END_LENGTH);
      comments.push(remainder);
      let textAfterComment = line.substring(j + BLOCK_COMMENT_END_LENGTH);
      line = textBeforeComment + ' ' + textAfterComment;
      //...add comment token just-in-case...
      result.push(createToken(COMMENT_TYPE, comments.join('\n'), false));
      //...and continue processing like nothing happened.
    }

    // ...strip line comments to 1 newline
    i = line.indexOf(LINE_COMMENT);
    if (i >= 0) {
      let comment = line.substring(i);
      line = line.substring(0, i) + '\n';
      //...add comment token just-in-case...
      result.push(createToken(COMMENT_TYPE, comment, false));
      // TODO: Should this be added AFTER the current token?
      //...and continue processing like nothing happened.
    }

    // NOTE: Notes are similar to block comments, except it
    //  can nest other comments, so comment scanning must
    //  continue every line-- hence the extra logic.

    // ...strip notes to 1 whitespace
    if (!findingNotes) {
      i = line.indexOf(NOTE_START);
      if (i >= 0) {
        findingNotes = true;
        textBeforeNotes = line.substring(0, i);
        line = line.substring(i + NOTE_START_LENGTH);
      }
    }
    // ...trying to find more notes. Skip everything else.
    if (findingNotes) {
      let j = line.indexOf(NOTE_END);
      if (j >= 0) {
        let remainder = line.substring(0, j);
        notes.push(remainder);
        let textAfterNotes = line.substring(j + NOTE_END_LENGTH);
        line = textBeforeNotes + ' ' + textAfterNotes;
        //...add note token...
        result.push(createToken(NOTE_TYPE, notes.join('\n'), false));
        notes.length = 0;
        findingNotes = false;
        //...and continue processing this line like nothing happened.
      } else {
        //...just more notes...
        notes.push(line);
        if (lineIndex >= lineCount - 1) {
          // This is the last line. Better put in the
          // notes before it's over.
          result.push(createToken(NOTE_TYPE, notes.join('\n'), false));
          notes.length = 0;
          findingNotes = false;
          //...and stop processing cause it is the last line.
        }
      }
      //...and continue processing.
      continue;
    }

    // == Now to process front matter!...
    if (findingFrontMatter) {
      if (frontMatterKey.length <= 0 && line.trim().length <= 0) {
        // ...newlines before front matter. Skip it :)
        continue;
      }
      let k = line.indexOf(FRONT_MATTER_DELIMITER);
      // ...maybe this is a front matter key?
      if (k >= 0) {
        if (frontMatterKey.length > 0) {
          // ...finish the previous key.
          currentToken = createFrontMatterToken(
            /** @type {FountainTokenFrontMatterStyle} */ (frontMatterKey),
            frontMatterValue,
          );
          result.push(currentToken);
        }
        // ...get new key.
        frontMatterKey = line.substring(0, k).trim();
        frontMatterValue = line.substring(k + 1).trim();
        continue;
      }
      // ...or this is a front matter value!
      else if (FRONT_MATTER_VALUE_PATTERN.test(line)) {
        if (frontMatterValue.length > 0) {
          frontMatterValue += '\n';
        }
        frontMatterValue += line.trim();
        //...and continue processing front matter.
        continue;
      } else {
        // ...an empty line! We should expect no more front matter!
        findingFrontMatter = false;
        if (frontMatterKey.length > 0) {
          // ...finish last key:value pair.
          currentToken = createFrontMatterToken(
            /** @type {FountainTokenFrontMatterStyle} */ (frontMatterKey),
            frontMatterValue,
          );
          result.push(currentToken);
          frontMatterKey = '';
          frontMatterValue = '';
        }
        // NOTE: "A page break is implicit after the Title Page"
        //  ...so here it is...
        currentToken = createToken(PAGE_BREAK_TYPE, '', false);
        result.push(currentToken);
        //...and start actually processing the document.
        prevToken = currentToken;

        if (line.length > 0) {
          // ...not a valid front matter! Let's actually process this line now.
        } else {
          // ...valid end of the front matter! Skip the empty line and start!
          continue;
        }
      }
    }

    // == Now to process tokens!...

    // ...for forced priority patterns
    if (HEADING_FORCE_PATTERN.test(line)) {
      // Start a new heading block
      currentToken = createToken(HEADING_TYPE, line.substring(1).trim(), true);
      result.push(currentToken);
    } else if (ACTION_FORCE_PATTERN.test(line)) {
      // Start a new action block
      currentToken = createToken(ACTION_TYPE, line.substring(1), true);
      result.push(currentToken);
    } else if (CHARACTER_FORCE_PATTERN.test(line)) {
      // Start a new character block
      if (CHARACTER_SIMULTANEOUS_FORCE_PATTERN.test(line)) {
        //...as a simultaneous character.
        currentToken = createToken(
          CHARACTER_TYPE,
          line.substring(1, line.length - 1).trim(),
          true,
          CHARACTER_SIMULTANEOUS_STYLE,
        );
        result.push(currentToken);
      } else {
        currentToken = createToken(
          CHARACTER_TYPE,
          line.substring(1).trim(),
          true,
        );
        result.push(currentToken);
      }
    } else if (LYRIC_FORCE_PATTERN.test(line)) {
      // Start a new lyric block
      currentToken = createToken(LYRIC_TYPE, line.substring(1).trim(), true);
      result.push(currentToken);
    } else if (ACTION_CENTERED_FORCE_PATTERN.test(line)) {
      // NOTE: This must come BEFORE transition pattern (because they overlap).
      // Start a new action block (with centered style)
      currentToken = createToken(
        ACTION_TYPE,
        line.substring(1, line.length - 1).trim(),
        true,
        ACTION_CENTERED_STYLE,
      );
      result.push(currentToken);
      // ...centered action blocks are standalone. It cannot be continued.
      currentToken = null;
    } else if (TRANSITION_FORCE_PATTERN.test(line)) {
      // Start a new transition block
      currentToken = createToken(
        TRANSITION_TYPE,
        line.substring(1).trim(),
        true,
      );
      result.push(currentToken);
    } else if (PAGE_BREAK_FORCE_PATTERN.test(line)) {
      // Start a new page break block
      currentToken = createToken(PAGE_BREAK_TYPE, '', true);
      result.push(currentToken);
    } else if (SECTION_FORCE_PATTERN.test(line)) {
      // Start a new section block
      let [_, level, section] = SECTION_CAPTURE_PATTERN.exec(line) || [];
      currentToken = createSectionToken(section.trim(), level.length);
      result.push(currentToken);
    } else if (SYNOPSIS_FORCE_PATTERN.test(line)) {
      // Start a new synopsis block
      currentToken = createToken(SYNOPSIS_TYPE, line.substring(1).trim(), true);
      result.push(currentToken);
    }
    // ...for regular patterns
    else if (HEADING_PATTERN.test(line)) {
      // Start a new heading block
      currentToken = createToken(HEADING_TYPE, line.trim(), false);
      result.push(currentToken);
    } else if (TRANSITION_PATTERN.test(line)) {
      // Start a new transition block
      currentToken = createToken(TRANSITION_TYPE, line.trim(), false);
      result.push(currentToken);
    } else if (CHARACTER_PATTERN.test(line)) {
      // Start a new character block
      if (CHARACTER_SIMULTANEOUS_FORCE_PATTERN.test(line)) {
        //...as a simultaneous character.
        currentToken = createToken(
          CHARACTER_TYPE,
          line.substring(0, line.length - 1).trim(),
          false,
          CHARACTER_SIMULTANEOUS_STYLE,
        );
        result.push(currentToken);
      } else {
        currentToken = createToken(CHARACTER_TYPE, line.trim(), false);
        result.push(currentToken);
      }
    }
    // ...for continued content
    else if (prevToken?.type === CHARACTER_TYPE) {
      // Previous was a character...
      if (PARENTHETICAL_PATTERN.test(line)) {
        // ...this should be parenthetical
        currentToken = createToken(PARENTHETICAL_TYPE, line.trim(), false);
        result.push(currentToken);
        // and start a new dialogue.
        currentToken = createToken(DIALOGUE_TYPE, '', false);
        result.push(currentToken);
      } else if (line.length > 0) {
        // ...or this should be non-empty dialogue.
        currentToken = createToken(DIALOGUE_TYPE, line.trim(), false);
        result.push(currentToken);
      } else {
        // ...or this is just an empty newline. No token.
        currentToken = null;
      }
    } else if (prevToken?.type === DIALOGUE_TYPE) {
      // Previous was a dialogue...
      if (PARENTHETICAL_PATTERN.test(line)) {
        // ...this should be parenthetical
        currentToken = createToken(PARENTHETICAL_TYPE, line.trim(), false);
        result.push(currentToken);
        // and continue a new dialogue.
        currentToken = createToken(DIALOGUE_TYPE, '', false);
        result.push(currentToken);
      } else if (line.length > 0) {
        // ...or this should continue the dialogue.
        currentToken = prevToken;
        if (currentToken.text.length > 0) {
          currentToken.text += '\n';
        }
        currentToken.text += line.trim();
      } else {
        // ...or this is just an empty newline. End of dialogue.
        currentToken = null;
      }
    } else if (prevToken?.type === ACTION_TYPE) {
      // Append to the action.
      currentToken = prevToken;
      if (currentToken.text.length > 0) {
        currentToken.text += '\n';
      }
      currentToken.text += line;
    }
    // ...for anything else.
    else if (!prevToken && line.length > 0) {
      // There's nothing else, so it's a new action block.
      currentToken = createToken(ACTION_TYPE, line, false);
      result.push(currentToken);
    } else if (line.length > 0) {
      // There's expected continued content, but it's not handled!
      currentToken = createToken(UNKNOWN_TYPE, line, false);
      result.push(currentToken);
    }
    prevToken = currentToken;
  }
  return result;
}

/**
 * @param {FountainTokenType} type
 * @param {string} text
 * @param {boolean} forced
 * @param {FountainTokenStyle} style
 */
export function createToken(type, text, forced, style = '') {
  return {
    type: /** @type {FountainTokenType} */ (type),
    text,
    style: /** @type {FountainTokenStyle} */ (style),
    forced,
  };
}

/**
 * @param {FountainTokenFrontMatterStyle} key
 * @param {string} value
 */
function createFrontMatterToken(key, value) {
  const frontMatterStyle = /** @type {FountainTokenFrontMatterStyle} */ (key);
  return createToken(FRONT_MATTER_TYPE, value, true, frontMatterStyle);
}

/**
 * @param {string} title
 * @param {number} level
 */
function createSectionToken(title, level) {
  const headingStyle = /** @type {FountainTokenHeadingStyle} */ (`h${level}`);
  return createToken(SECTION_TYPE, title, true, headingStyle);
}
