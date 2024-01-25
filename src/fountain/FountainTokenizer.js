import { createToken } from './FountainTokenHelper';

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
const ACTION_FORCE_PATTERN = /^!/;
const CHARACTER_FORCE_PATTERN = /^@/;
const CHARACTER_SIMULTANEOUS_FORCE_PATTERN = /\^$/;
const LYRIC_FORCE_PATTERN = /^~/;
const ACTION_CENTERED_FORCE_PATTERN = /^>\s*.+\s*<$/;
const TRANSITION_FORCE_PATTERN = /^>/;
const PAGE_BREAK_FORCE_PATTERN = /^\s*(===+|---+)\s*$/;
const SECTION_FORCE_PATTERN = /^#+/;
const SYNOPSIS_FORCE_PATTERN = /^=/;

const HEADING_PATTERN = /^(INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)\W/i;
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

/** @typedef {(out: FountainTokenizer, line: string) => boolean} FountainTokenizerPlugin*/

const TOKEN_HANDLERS = [
  // ...for front matter
  FrontMatterToken,
  // ...for notes
  // NoteToken,
  // ...for forced priority patterns
  HeadingTokenOverride,
  ActionTokenOverride,
  CharacterTokenOverride,
  LyricTokenOverride,
  ActionCenteredTokenOverride,
  TransitionTokenOverride,
  PageBreakToken,
  SectionToken,
  SynopsisToken,
  // ...for regular patterns
  HeadingToken,
  TransitionToken,
  CharacterToken,
  // ...for continued content
  DialogueBlockToken,
  ActionBlockToken,
  // ...for anything else.
  ActionDefaultToken,
];

/**
 * @param {string} text
 */
export function tokenize(text) {
  return new FountainTokenizer(text, TOKEN_HANDLERS).tokenize();
}

class FountainTokenizer {
  /**
   * @param {string} source
   * @param {Array<FountainTokenizerPlugin>} plugins
   */
  constructor(source, plugins = TOKEN_HANDLERS) {
    this.plugins = [...plugins, UnknownToken];
    /** @type {Array<FountainToken|null>} */
    this.tokens = [];
    /** @type {'front-matter'|'screenplay'} */
    this.pageType = 'front-matter';
    this.source = source;
    this.lines = source.split('\n');
    this.lineIndex = 0;
    this.lineCount = this.lines.length;
  }

  currentLine() {
    return this.lines[this.lineIndex];
  }

  nextLine() {
    if (!this.hasNextLine()) {
      this.lineIndex = this.lineCount;
      return '';
    }
    return this.lines[++this.lineIndex];
  }

  hasNextLine() {
    return this.lineIndex < this.lineCount - 1;
  }

  /**
   * @param {string} newLine
   */
  replaceLine(newLine) {
    this.lines[this.lineIndex] = newLine;
    return newLine;
  }

  /**
   * @param {FountainToken|null} token
   */
  push(token) {
    this.tokens.push(token);
  }

  peek() {
    // For continued content.
    return this.tokens.at(-1) ?? null;
  }

  tokenize() {
    let result = this.tokens;

    let notes = [];
    let findingNotes = false;
    let textBeforeNotes = '';

    // Split by newlines
    while (this.lineIndex < this.lineCount) {
      let line = this.currentLine();

      // == Check for traps!...
      // ...strip block/boneyard comments to 1 whitespace
      let i = line.indexOf(BLOCK_COMMENT_START);
      if (i >= 0) {
        let comments = [];
        let textBeforeComment = line.substring(0, i);
        let j = line.indexOf(BLOCK_COMMENT_END, i + BLOCK_COMMENT_START_LENGTH);
        // ...ignore all syntax until the end.
        while (j < 0) {
          comments.push(line.substring(i));
          // ...advance to newline...
          if (!this.hasNextLine()) {
            // ...the rest of the lines are part of the
            // un-closed block comment, so let's just
            // finish whatever we have now.
            i = 0;
            j = line.length;
            break;
          }
          line = this.nextLine();
          i = 0;
          j = line.indexOf(BLOCK_COMMENT_END);
        }
        let remainder = line.substring(i, j + BLOCK_COMMENT_END_LENGTH);
        comments.push(remainder);
        let textAfterComment = line.substring(j + BLOCK_COMMENT_END_LENGTH);
        line = textBeforeComment + ' ' + textAfterComment;
        //...add comment token just-in-case...
        this.push(createToken(COMMENT_TYPE, comments.join('\n'), false));
        //...and continue processing like nothing happened.
      }

      // ...strip line comments to 1 newline
      i = line.indexOf(LINE_COMMENT);
      if (i >= 0) {
        let comment = line.substring(i);
        line = this.replaceLine(line.substring(0, i) + '\n');
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
          line = this.replaceLine(line.substring(i + NOTE_START_LENGTH));
        }
      }
      // ...trying to find more notes. Skip everything else.
      if (findingNotes) {
        let j = line.indexOf(NOTE_END);
        if (j >= 0) {
          let remainder = line.substring(0, j);
          notes.push(remainder);
          let textAfterNotes = line.substring(j + NOTE_END_LENGTH);
          line = this.replaceLine(textBeforeNotes + ' ' + textAfterNotes);
          //...add note token...
          result.push(createToken(NOTE_TYPE, notes.join('\n'), true));
          notes.length = 0;
          findingNotes = false;
          //...and continue processing this line like nothing happened.
          continue;
        } else {
          //...just more notes...
          notes.push(line);
          if (!this.hasNextLine()) {
            // This is the last line. Better put in the
            // notes before it's over.
            result.push(createToken(NOTE_TYPE, notes.join('\n'), true));
            notes.length = 0;
            findingNotes = false;
            //...and stop processing cause it is the last line.
          }
        }
        //...and continue processing.
        this.nextLine();
        continue;
      }

      // == Now to process tokens!...
      for (let plugin of this.plugins) {
        line = this.currentLine();
        let result = plugin(this, line);
        if (result === true) {
          break;
        }
      }
      this.nextLine();
    }
    return /** @type {Array<FountainToken>} */ (
      result.filter((item) => item !== null)
    );
  }
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

/** @type {FountainTokenizerPlugin} */
function HeadingTokenOverride(out, line) {
  if (!HEADING_FORCE_PATTERN.test(line)) {
    return false;
  }
  // Start a new heading block
  out.push(createToken(HEADING_TYPE, line.substring(1).trim(), true));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function HeadingToken(out, line) {
  if (!HEADING_PATTERN.test(line)) {
    return false;
  }
  // Start a new heading block
  out.push(createToken(HEADING_TYPE, line.trim(), false));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function ActionTokenOverride(out, line) {
  if (!ACTION_FORCE_PATTERN.test(line)) {
    return false;
  }
  // Start a new action block
  out.push(createToken(ACTION_TYPE, line.substring(1), true));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function CharacterTokenOverride(out, line) {
  if (!CHARACTER_FORCE_PATTERN.test(line)) {
    return false;
  }

  // Start a new character block
  if (CHARACTER_SIMULTANEOUS_FORCE_PATTERN.test(line)) {
    //...as a simultaneous character.
    out.push(
      createToken(
        CHARACTER_TYPE,
        line.substring(1, line.length - 1).trim(),
        true,
        CHARACTER_SIMULTANEOUS_STYLE,
      ),
    );
  } else {
    out.push(createToken(CHARACTER_TYPE, line.substring(1).trim(), true));
  }

  return true;
}

/** @type {FountainTokenizerPlugin} */
function LyricTokenOverride(out, line) {
  if (!LYRIC_FORCE_PATTERN.test(line)) {
    return false;
  }
  // Start a new lyric block
  out.push(createToken(LYRIC_TYPE, line.substring(1).trim(), true));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function ActionCenteredTokenOverride(out, line) {
  if (!ACTION_CENTERED_FORCE_PATTERN.test(line)) {
    return false;
  }
  // NOTE: This must come BEFORE transition pattern (because they overlap).
  // Start a new action block (with centered style)
  out.push(
    createToken(
      ACTION_TYPE,
      line.substring(1, line.length - 1).trim(),
      true,
      ACTION_CENTERED_STYLE,
    ),
  );
  // ...centered action blocks are standalone. It cannot be continued.
  out.push(null);
  return true;
}

/** @type {FountainTokenizerPlugin} */
function DialogueBlockToken(out, line) {
  // ...for continued content
  const prev = out.peek();
  if (!prev) {
    return false;
  }
  if (prev.type === CHARACTER_TYPE) {
    // Previous was a character...
    if (PARENTHETICAL_PATTERN.test(line)) {
      // ...this should be parenthetical
      out.push(createToken(PARENTHETICAL_TYPE, line.trim(), false));
      // and start a new dialogue.
      out.push(createToken(DIALOGUE_TYPE, '', false));
    } else if (line.length > 0) {
      // ...or this should be non-empty dialogue.
      out.push(createToken(DIALOGUE_TYPE, line.trim(), false));
    } else {
      // ...or this is just an empty newline. No token.
      out.push(null);
    }
    return true;
  } else if (prev.type === DIALOGUE_TYPE) {
    // Previous was a dialogue...
    if (PARENTHETICAL_PATTERN.test(line)) {
      // ...this should be parenthetical
      out.push(createToken(PARENTHETICAL_TYPE, line.trim(), false));
      // and continue a new dialogue.
      out.push(createToken(DIALOGUE_TYPE, '', false));
    } else if (line.length > 0) {
      // ...or this should continue the dialogue.
      if (prev.text.length > 0) {
        prev.text += '\n';
      }
      prev.text += line.trim();
    } else {
      // ...or this is just an empty newline. End of dialogue.
      out.push(null);
    }
    return true;
  } else {
    return false;
  }
}

/** @type {FountainTokenizerPlugin} */
function ActionBlockToken(out, line) {
  // ...for continued content
  const prev = out.peek();
  if (!prev) {
    return false;
  }
  if (prev.type !== ACTION_TYPE) {
    return false;
  }
  // Append to the action.
  if (prev.text.length > 0) {
    prev.text += '\n';
  }
  prev.text += line;
  return true;
}

/** @type {FountainTokenizerPlugin} */
function ActionDefaultToken(out, line) {
  if (line.length <= 0) {
    return false;
  }
  if (line.trim().length <= 0) {
    // It's an action, but skip the token cause it's just whitepsace.
    return true;
  }
  // There's nothing else but some content, so it's a new action block.
  out.push(createToken(ACTION_TYPE, line, false));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function CharacterToken(out, line) {
  if (!CHARACTER_PATTERN.test(line)) {
    return false;
  }

  // Start a new character block
  if (CHARACTER_SIMULTANEOUS_FORCE_PATTERN.test(line)) {
    //...as a simultaneous character.
    out.push(
      createToken(
        CHARACTER_TYPE,
        line.substring(0, line.length - 1).trim(),
        false,
        CHARACTER_SIMULTANEOUS_STYLE,
      ),
    );
  } else {
    out.push(createToken(CHARACTER_TYPE, line.trim(), false));
  }
  return true;
}

/** @type {FountainTokenizerPlugin} */
function TransitionTokenOverride(out, line) {
  if (!TRANSITION_FORCE_PATTERN.test(line)) {
    return false;
  }

  // Start a new transition block
  out.push(createToken(TRANSITION_TYPE, line.substring(1).trim(), true));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function PageBreakToken(out, line) {
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

/** @type {FountainTokenizerPlugin} */
function SectionToken(out, line) {
  if (!SECTION_FORCE_PATTERN.test(line)) {
    return false;
  }

  // Start a new section block
  let [_, level, section] = SECTION_CAPTURE_PATTERN.exec(line) || [];
  out.push(createSectionToken(section.trim(), level.length));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function SynopsisToken(out, line) {
  if (!SYNOPSIS_FORCE_PATTERN.test(line)) {
    return false;
  }

  // Start a new synopsis block
  out.push(createToken(SYNOPSIS_TYPE, line.substring(1).trim(), true));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function TransitionToken(out, line) {
  if (!TRANSITION_PATTERN.test(line)) {
    return false;
  }
  // Start a new transition block
  out.push(createToken(TRANSITION_TYPE, line.trim(), false));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function UnknownToken(out, line) {
  if (line.length <= 0) {
    return false;
  }
  // There's expected continued content, but it's not handled!
  out.push(createToken(UNKNOWN_TYPE, line, false));
  return true;
}

/** @type {FountainTokenizerPlugin} */
function FrontMatterToken(out, line) {
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
