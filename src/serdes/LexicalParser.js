/** @typedef {ReturnType<createLexicalStateRoot>} ExtractedLexicalState */
/** @typedef {ReturnType<createLexicalStateParagraph>} ExtractedLexicalStateParagraph */

/**
 * @param {string} text
 */
export function createLexicalStateFromText(text) {
  return createLexicalStateRoot([createLexicalStateParagraph(text)]);
}

/**
 * @param {string} text
 */
function createLexicalStateParagraph(text) {
  return {
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text,
        type: 'text',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  };
}

/**
 * @param {Array<ExtractedLexicalStateParagraph>} [children]
 */
function createLexicalStateRoot(children = []) {
  return {
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  };
}

/**
 * @param {ExtractedLexicalState} out
 * @param {ExtractedLexicalState} state
 */
export function mergeLexicalStates(out, state) {
  const outRootChildren = out?.root?.children;
  const stateRootChildren = state?.root?.children;
  if (!outRootChildren || !stateRootChildren) {
    return;
  }
  outRootChildren.push(...stateRootChildren);
}
