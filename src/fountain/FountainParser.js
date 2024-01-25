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

const NOTE_SHOT_NOTYPE_PATTERN = /^!+[^!](.+)/;
const NOTE_SHOT_TYPE_PATTERN = /^([A-Z]+)[\W](.+)/;

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
    let shotType = '';
    let shotText;
    let trimmedLine = line.trim();
    let noTypeMatched = NOTE_SHOT_NOTYPE_PATTERN.exec(trimmedLine);
    if (noTypeMatched) {
      const [_, desc] = noTypeMatched;
      shotText = desc.trim();
    } else {
      if (prevShot && (line.startsWith('   ') || line.startsWith('\t'))) {
        // TODO: Started with 3 whitespace or tab... so append!
      }
      let typeMatched = NOTE_SHOT_TYPE_PATTERN.exec(trimmedLine);
      if (typeMatched) {
        const [_, type, desc] = typeMatched;
        shotType = type;
        shotText = desc;
      } else {
        shotText = trimmedLine;
      }
    }
    if (shotText.length <= 0) {
      continue;
    }
    // @ts-expect-error shot token type is Eagle-specific
    result.push(createToken('shot', shotText, false, shotType));
  }
  return result;
}
