import { createToken } from '@/fountain/FountainTokenHelper';

import { CHARACTER_TYPE } from './CharacterToken';

export const PARENTHETICAL_TYPE = 'parenthetical';
export const DIALOGUE_TYPE = 'dialogue';
const PARENTHETICAL_PATTERN = /^\s*\(.*\)\s*$/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function DialogueBlockToken(out, line) {
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
