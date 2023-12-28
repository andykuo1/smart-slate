import {
  createBlock,
  createDocument,
  createScene,
} from '@/stores/document/DocumentStore';

import { createLexicalStateFromText } from './LexicalParser';

/**
 * @param {Array<import('fountain-js').Token>} tokens
 * @returns {import('@/stores/document/DocumentStore').Document}
 */
export function fountainTokensToDocument(tokens) {
  let result = createDocument();

  function addScene() {
    let s = createScene();
    result.scenes[s.sceneId] = s;
    result.sceneOrder.push(s.sceneId);
    return s;
  }

  /**
   * @param {import('@/stores/document/DocumentStore').Scene} scene
   */
  function addBlock(scene) {
    let b = createBlock();
    result.blocks[b.blockId] = b;
    scene.blockIds.push(b.blockId);
    return b;
  }

  let titleScene = addScene();
  let titleBlock = addBlock(titleScene);
  let titleLines = [];
  let titleTitle = '';

  let currentScene = null;
  let currentBlock = null;

  /** @type {Array<string>} */
  let lines = [];
  for (let token of tokens) {
    const { text = '' } = token;
    if (token.is_title) {
      if (token.type === 'title') {
        titleTitle = text;
      } else {
        titleLines.push(text);
      }
      continue;
    }
    if (!currentScene) {
      currentScene = addScene();
      if (token.type === 'scene_heading') {
        // There is a title! And this is the first!
        currentScene.sceneHeading = text;
        // ... and now skip this token.
        continue;
      } else {
        // There's an no-title scene at the beginning! ... keep it.
        currentScene.sceneHeading = 'UNNAMED';
        // ... and now process the token.
      }
    }
    switch (token.type) {
      case 'scene_heading':
        // ... the next scene.
        currentScene = addScene();
        currentScene.sceneHeading = text;
        break;
      case 'action':
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'lexical';
        currentBlock.content = JSON.stringify(createLexicalStateFromText(text));
        break;
      case 'centered':
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'lexical';
        currentBlock.content = JSON.stringify(createLexicalStateFromText(text));
        break;
      case 'transition':
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'lexical';
        currentBlock.content = JSON.stringify(createLexicalStateFromText(text));
        break;
      case 'dialogue_begin':
        currentBlock = addBlock(currentScene);
        lines.length = 0;
        break;
      case 'dialogue_end':
        if (!currentBlock) {
          currentBlock = addBlock(currentScene);
        }
        currentBlock.contentType = 'lexical';
        currentBlock.content = JSON.stringify(
          createLexicalStateFromText(lines.join('\n')),
        );
        lines.length = 0;
        break;
      case 'dual_dialogue_begin':
        currentBlock = addBlock(currentScene);
        lines.length = 0;
        break;
      case 'dual_dialogue_end':
        if (!currentBlock) {
          currentBlock = addBlock(currentScene);
        }
        currentBlock.contentType = 'lexical';
        currentBlock.content = JSON.stringify(
          createLexicalStateFromText(lines.join('\n')),
        );
        lines.length = 0;
        break;
      case 'character':
        lines.push(text);
        break;
      case 'dialogue':
        lines.push(text);
        break;
      case 'parenthetical':
        lines.push(text);
        break;
      default:
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'lexical';
        currentBlock.content = JSON.stringify(
          createLexicalStateFromText(JSON.stringify(token.text)),
        );
    }
  }

  // Any remaining dialogue lines...
  if (lines.length > 0) {
    if (!currentScene) {
      currentScene = addScene();
    }
    if (!currentBlock) {
      currentBlock = addBlock(currentScene);
    }
    currentBlock.contentType = 'lexical';
    currentBlock.content = JSON.stringify(
      createLexicalStateFromText(lines.join('\n')),
    );
    lines.length = 0;
  }

  // Set title...
  if (titleLines.length > 0) {
    titleBlock.contentType = 'lexical';
    titleBlock.content = JSON.stringify(
      createLexicalStateFromText(titleLines.join('\n')),
    );
  }
  result.documentTitle = titleTitle || 'My Fountain Movie';
  return result;
}

/**
 * @param {Array<import('fountain-js').Token>} tokens
 * @returns {import('@/stores/document/DocumentStore').Document}
 */
export function fountainTokensToDocumentByScene(tokens) {
  let result = createDocument();

  function addScene() {
    let s = createScene();
    result.scenes[s.sceneId] = s;
    result.sceneOrder.push(s.sceneId);
    return s;
  }

  /**
   * @param {import('@/stores/document/DocumentStore').Scene} scene
   */
  function addBlock(scene) {
    let b = createBlock();
    result.blocks[b.blockId] = b;
    scene.blockIds.push(b.blockId);
    return b;
  }

  let titleScene = addScene();
  let titleBlock = addBlock(titleScene);
  let titleLines = [];
  let titleTitle = '';

  let currentScene = null;
  let currentContents = [];

  /** @type {Array<string>} */
  let lines = [];
  for (let token of tokens) {
    const { text = '' } = token;
    if (token.is_title) {
      if (token.type === 'title') {
        titleTitle = text;
      } else {
        titleLines.push(text);
      }
      continue;
    }
    if (!currentScene) {
      currentScene = addScene();
      if (token.type === 'scene_heading') {
        // There is a title! And this is the first!
        currentScene.sceneHeading = text;
        // ... and now skip this token.
        continue;
      } else {
        // There's an no-title scene at the beginning! ... keep it.
        currentScene.sceneHeading = 'UNNAMED';
        // ... and now process the token.
      }
    }
    switch (token.type) {
      case 'scene_heading':
        // ... the next scene.
        if (currentContents.length > 0) {
          let currentBlock = addBlock(currentScene);
          currentBlock.contentType = 'lexical';
          currentBlock.content = JSON.stringify(
            createLexicalStateFromText(currentContents.join('\n\n')),
          );
          currentContents.length = 0;
        }
        currentScene = addScene();
        currentScene.sceneHeading = text;
        break;
      case 'action':
        currentContents.push(text);
        break;
      case 'centered':
        currentContents.push(text);
        break;
      case 'transition':
        currentContents.push(text);
        break;
      case 'dialogue_begin':
        lines.length = 0;
        break;
      case 'dialogue_end':
        currentContents.push(lines.join('\n'));
        lines.length = 0;
        break;
      case 'dual_dialogue_begin':
        lines.length = 0;
        break;
      case 'dual_dialogue_end':
        currentContents.push(lines.join('\n'));
        lines.length = 0;
        break;
      case 'character':
        lines.push(text);
        break;
      case 'dialogue':
        lines.push(text);
        break;
      case 'parenthetical':
        lines.push(text);
        break;
      default:
        currentContents.push(JSON.stringify(token.text));
    }
  }

  // Any remaining dialogue lines...
  if (lines.length > 0) {
    if (!currentScene) {
      currentScene = addScene();
    }
    currentContents.push(lines.join('\n'));
    lines.length = 0;
  }

  // Any remaining content...
  if (currentContents.length > 0) {
    if (!currentScene) {
      currentScene = addScene();
    }
    let currentBlock = addBlock(currentScene);
    currentBlock.contentType = 'lexical';
    currentBlock.content = JSON.stringify(
      createLexicalStateFromText(currentContents.join('\n\n')),
    );
    currentContents.length = 0;
  }

  // Set title...
  if (titleLines.length > 0) {
    titleBlock.contentType = 'lexical';
    titleBlock.content = JSON.stringify(
      createLexicalStateFromText(titleLines.join('\n')),
    );
  }
  result.documentTitle = titleTitle || 'My Fountain Movie';
  return result;
}
