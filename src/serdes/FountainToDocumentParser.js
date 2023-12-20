import {
  createBlock,
  createDocument,
  createScene,
} from '@/stores/DocumentStore';

/**
 * @param {Array<import('fountain-js').Token>} tokens
 * @returns {import('@/stores/DocumentStore').Document}
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
   * @param {import('@/stores/DocumentStore').Scene} scene
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
        currentBlock.content = text;
        break;
      case 'centered':
        currentBlock = addBlock(currentScene);
        currentBlock.content = text;
        break;
      case 'transition':
        currentBlock = addBlock(currentScene);
        currentBlock.content = text;
        break;
      case 'dialogue_begin':
        currentBlock = addBlock(currentScene);
        lines.length = 0;
        break;
      case 'dialogue_end':
        if (!currentBlock) {
          currentBlock = addBlock(currentScene);
        }
        currentBlock.content = lines.join('\n');
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
        currentBlock.content = lines.join('\n');
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
        currentBlock.content = JSON.stringify(token.text);
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
    currentBlock.content = lines.join('\n');
    lines.length = 0;
  }

  // Set title...
  if (titleLines.length > 0) {
    titleBlock.content = titleLines.join('\n');
  }
  result.documentTitle = titleTitle || 'My Fountain Movie';
  return result;
}
