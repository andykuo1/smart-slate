import { createToken } from './FountainTokenHelper';
import {
  ACTION_STYLES,
  ACTION_TYPE,
  ActionBlockToken,
  ActionCenteredTokenOverride,
  ActionDefaultToken,
  ActionTokenOverride,
} from './tokens/ActionToken';
import {
  CHARACTER_STYLES,
  CHARACTER_TYPE,
  CharacterToken,
  CharacterTokenOverride,
} from './tokens/CharacterToken';
import {
  DIALOGUE_TYPE,
  DialogueBlockToken,
  PARENTHETICAL_TYPE,
} from './tokens/DialogueToken';
import {
  FRONT_MATTER_STYLES,
  FRONT_MATTER_TYPE,
  FrontMatterToken,
} from './tokens/FrontMatterToken';
import {
  HEADING_STYLES,
  HEADING_TYPE,
  HeadingToken,
  HeadingTokenOverride,
} from './tokens/HeadingToken';
import { LYRIC_TYPE, LyricTokenOverride } from './tokens/LyricToken';
import { PAGE_BREAK_TYPE, PageBreakToken } from './tokens/PageBreakToken';
import { SECTION_TYPE, SectionToken } from './tokens/SectionToken';
import { SYNOPSIS_TYPE, SynopsisToken } from './tokens/SynopsisToken';
import {
  TRANSITION_TYPE,
  TransitionToken,
  TransitionTokenOverride,
} from './tokens/TransitionToken';
import {
  UNKNOWN_STYLES,
  UNKNOWN_TYPE,
  UnknownToken,
} from './tokens/UnknownToken';

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
 * @typedef {import('./tokens/UnknownToken').FountainTokenUnknownStyle|
 * import('./tokens/ActionToken').FountainTokenActionStyle|
 * import('./tokens/CharacterToken').FountainTokenCharacterStyle|
 * import('./tokens/HeadingToken').FountainTokenHeadingStyle|
 * import('./tokens/FrontMatterToken').FountainTokenFrontMatterStyle} FountainTokenStyle
 */

const COMMENT_TYPE = 'comment';
const NOTE_TYPE = 'note';
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

/** @type {Array<FountainTokenStyle>} */
export const FOUNTAIN_TOKEN_STYLES = [
  ...UNKNOWN_STYLES,
  ...CHARACTER_STYLES,
  ...ACTION_STYLES,
  ...HEADING_STYLES,
  ...FRONT_MATTER_STYLES,
];

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
        this.replaceLine(textBeforeComment + ' ' + textAfterComment);
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
