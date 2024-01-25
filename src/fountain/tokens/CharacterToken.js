import { createToken } from '@/fountain/FountainTokenHelper';

/**
 * @typedef {CHARACTER_SIMULTANEOUS_STYLE} FountainTokenCharacterStyle
 */

export const CHARACTER_TYPE = 'character';
export const CHARACTER_SIMULTANEOUS_STYLE = 'simultaneous';
/** @type {Array<FountainTokenCharacterStyle>} */
export const CHARACTER_STYLES = [CHARACTER_SIMULTANEOUS_STYLE];

const CHARACTER_PATTERN = /^\s*(?=[A-Z])[A-Z\d\s\W]+(\(.+\))*\s*$/;
const CHARACTER_FORCE_PATTERN = /^@/;
const CHARACTER_SIMULTANEOUS_FORCE_PATTERN = /\^$/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function CharacterToken(out, line) {
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

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function CharacterTokenOverride(out, line) {
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
