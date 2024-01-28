import { createToken } from './FountainTokenHelper';
import { tokenize } from './FountainTokenizer';

/**
 * @param {string} text
 */
export function parse(text) {
  let tokens = tokenize(text);
  return {
    text,
    tokens: tokens
      .map((token) => {
        if (token.type !== 'note') {
          return token;
        }
        let result = tokenizeNoteShots(token);
        if (result?.length > 0) {
          return result;
        } else {
          return token;
        }
      })
      .flat(),
  };
}

const NOTE_SHOT_TYPE_PATTERN = /^([A-Z-]+)[^\w-](?:\s*(of|OF|Of|oF)\s+)*(.+)$/;

const SHOT_FORCE_PATTERN = /^shot:/i;

/**
 * @param {import('./FountainTokenizer').FountainToken} noteToken
 */
function tokenizeNoteShots(noteToken) {
  /** @type {Array<import('./FountainTokenizer').FountainToken>} */
  let result = [];
  const noteText = noteToken.text;
  if (!SHOT_FORCE_PATTERN.test(noteText)) {
    return result;
  }
  const text = noteText.substring('shot:'.length);
  const lines = text.split('\n');
  let prevShot = null;
  for (let line of lines) {
    let shotType;
    let shotText;
    let trimmedLine = line.trim();
    if (prevShot && (line.startsWith('   ') || line.startsWith('\t'))) {
      // TODO: Started with 3 whitespace or tab... so append!
    }
    const typeMatched = NOTE_SHOT_TYPE_PATTERN.exec(trimmedLine);
    if (typeMatched) {
      const [_, type, _delimiter, desc] = typeMatched;
      shotType = reduceShotType(type);
      shotText = reduceShotDescription(desc);
    } else {
      shotType = '';
      shotText = trimmedLine;
    }
    if (shotText.length <= 0) {
      continue;
    }
    result.push(
      createToken(
        // @ts-expect-error shot token type is Eagle-specific
        'shot',
        shotText,
        false,
        shotType,
      ),
    );
  }
  return result;
}

/**
 * @param {string} shotType
 */
function reduceShotType(shotType) {
  if (/^-+$/.test(shotType)) {
    return '';
  }
  switch (shotType.toUpperCase()) {
    case 'SHOT':
    case 'S':
      return '';
    case 'WS':
    case 'WIDE':
    case 'W':
      return 'WS';
    case 'MS':
    case 'MID':
    case 'MEDIUM':
    case 'M':
      return 'MS';
    case 'CU':
    case 'CLOSEUP':
    case 'CLOSE-UP':
    case 'C':
      return 'CU';
    default:
      return shotType.toUpperCase();
  }
}

/**
 * @param {string} shotDescription
 */
function reduceShotDescription(shotDescription) {
  if (!shotDescription) {
    return '';
  }
  let result = /^\s*of\s+(.+)/i.exec(shotDescription);
  if (result) {
    let [_, text] = result;
    return text.trim();
  } else {
    return shotDescription.trim();
  }
}
