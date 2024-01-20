import { formatProjectId } from '@/components/takes/TakeNameFormat';
import {
  createBlock,
  createDocument,
  createScene,
  createShot,
} from '@/stores/document/DocumentStore';

import { createLexicalStateFromText } from './LexicalParser';

/**
 * @param {Array<import('./FountainTokenizer').FountainToken>} tokens
 */
export function fountainToDocument(tokens) {
  const documentParser = setupDocumentParser();
  const frontMatterParser = setupFrontMatterParser(documentParser);
  const { document: result, addScene, addBlock, addShot } = documentParser;
  const { addFrontMatterLine, bakeFrontMatter } = frontMatterParser;

  let currentScene = null;
  let currentBlock = null;
  let currentShot = null;

  /** @type {Array<string>} */
  let lines = [];
  for (let token of tokens) {
    if (token.type === 'front-matter') {
      addFrontMatterLine(token.text, token.style === 'Title');
      continue;
    }
    if (token.type === 'comment') {
      // Skip comments.
      continue;
    }
    if (token.type === 'page-break') {
      // Skip page breaks.
      continue;
    }
    if (token.type === 'section' || token.type === 'synopsis') {
      // Skip writer notes.
      continue;
    }
    if (!currentScene) {
      currentScene = addScene();
      if (token.type === 'heading') {
        // There is a title! And this is the first!
        currentScene.sceneHeading = token.text;
        // ... and now skip this token.
        continue;
      } else {
        // There's an no-title scene at the beginning! ... keep it.
        currentScene.sceneHeading = 'UNNAMED';
        // ... and now process the token.
      }
    }
    switch (token.type) {
      case 'heading':
        // ... the next scene.
        currentScene = addScene();
        currentScene.sceneHeading = token.text;
        break;
      case 'action':
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'fountain-json';
        currentBlock.content = token.text;
        if (token.style === 'centered') {
          currentBlock.contentStyle = 'centered';
        } else {
          currentBlock.contentStyle = 'action';
        }
        break;
      case 'character':
        lines.length = 0;
        lines.push(token.text);
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'fountain-json';
        currentBlock.content = lines.join('\n');
        currentBlock.contentStyle = 'dialogue';
        break;
      case 'dialogue':
        lines.push(token.text);
        if (currentBlock) {
          currentBlock.content = lines.join('\n');
        }
        break;
      case 'parenthetical':
        lines.push(token.text);
        if (currentBlock) {
          currentBlock.content = lines.join('\n');
        }
        break;
      case 'lyric':
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'fountain-json';
        currentBlock.content = token.text;
        currentBlock.contentStyle = 'lyric';
        break;
      case 'note':
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'fountain-json';
        currentBlock.content = token.text;
        currentBlock.contentStyle = 'note';
        break;
      case 'transition':
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'fountain-json';
        currentBlock.content = token.text;
        currentBlock.contentStyle = 'transition';
        break;
      // @ts-expect-error shot is a new type for documents.
      case 'shot':
        if (!currentBlock) {
          currentBlock = addBlock(currentScene);
          currentBlock.contentType = 'fountain-json';
          currentBlock.content = token.text;
          currentBlock.contentStyle = 'action';
        }
        currentShot = addShot(currentBlock);
        currentShot.description = token.text;
        currentShot.shotType = token.style;
        break;
      default:
        currentBlock = addBlock(currentScene);
        currentBlock.contentType = 'fountain-json';
        currentBlock.content = token.text;
        // @ts-expect-error The token is correct.
        currentBlock.contentStyle = token.type;
        break;
    }
  }
  bakeFrontMatter();
  return result;
}

/**
 * @param {ReturnType<setupDocumentParser>} documentParser
 */
function setupFrontMatterParser(documentParser) {
  // TODO: Title scenes (for now) will not be translated over. Let it die.
  let titleScene = createScene(); // addScene()
  let titleBlock = documentParser.addBlock(titleScene);
  /** @type {Array<string>} */
  let titleLines = [];
  let titleTitle = '';

  /**
   * @param {string} text
   * @param {boolean} isTitle
   */
  function addFrontMatterLine(text, isTitle) {
    if (isTitle) {
      titleTitle = text;
    } else {
      titleLines.push(text);
    }
  }

  function bakeFrontMatter() {
    // Set title...
    if (titleLines.length > 0) {
      titleBlock.contentType = 'lexical';
      titleBlock.content = JSON.stringify(
        createLexicalStateFromText(titleLines.join('\n')),
      );
    }
    // Set document settings...
    let result = documentParser.document;
    result.documentTitle = titleTitle || 'My Fountain Movie';
    result.settings.projectId = formatProjectId(result.documentTitle);
  }

  return {
    addFrontMatterLine,
    bakeFrontMatter,
  };
}

function setupDocumentParser() {
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

  /**
   * @param {import('@/stores/document/DocumentStore').Block} block
   */
  function addShot(block) {
    let s = createShot();
    result.shots[s.shotId] = s;
    block.shotIds.push(s.shotId);
    return s;
  }

  return {
    document: result,
    addScene,
    addBlock,
    addShot,
  };
}
