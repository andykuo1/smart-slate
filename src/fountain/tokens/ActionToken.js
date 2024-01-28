import { createToken } from '@/fountain/FountainTokenHelper';

/**
 * @typedef {ACTION_CENTERED_STYLE} FountainTokenActionStyle
 */

export const ACTION_TYPE = 'action';
export const ACTION_CENTERED_STYLE = 'centered';
/** @type {Array<FountainTokenActionStyle>} */
export const ACTION_STYLES = [ACTION_CENTERED_STYLE];

const ACTION_FORCE_PATTERN = /^!/;
const ACTION_CENTERED_FORCE_PATTERN = /^>\s*.+\s*<$/;

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function ActionTokenOverride(out, line) {
  if (!ACTION_FORCE_PATTERN.test(line)) {
    return false;
  }
  // Start a new action block
  out.push(createToken(ACTION_TYPE, line.substring(1), true));
  return true;
}

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function ActionCenteredTokenOverride(out, line) {
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

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function ActionBlockToken(out, line) {
  // ...for continued content
  const prev = out.peek();
  if (!prev) {
    return false;
  }
  if (prev.type !== ACTION_TYPE) {
    return false;
  }
  // Append to the action.
  if (prev.text.trim().length > 0) {
    // ...is it a double newline?
    if (prev.text.endsWith('\n')) {
      // ...then create a new action block.
      out.push(createToken(ACTION_TYPE, line, false));
      return true;
    } else {
      // ...then add a newline...
      prev.text += '\n';
    }
  }
  // ...and add it.
  prev.text += line;
  return true;
}

/** @type {import('@/fountain/FountainTokenizer').FountainTokenizerPlugin} */
export function ActionDefaultToken(out, line) {
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
