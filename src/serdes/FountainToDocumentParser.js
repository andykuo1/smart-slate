import { formatProjectId } from '@/components/takes/TakeNameFormat';
import {
  createBlock,
  createDocument,
  createScene,
  createShot,
  createStore,
} from '@/stores/document/DocumentStore';
import {
  addBlock,
  addDocument,
  addScene,
  addShot,
} from '@/stores/document/dispatch/DispatchAddDelete';

import { createLexicalStateFromText } from './LexicalParser';

/**
 * @param {Array<import('@/fountain/FountainTokenizer').FountainToken>} tokens
 * @param {object} [opts]
 * @param {string} [opts.defaultDocumentTitle]
 */
export function fountainToDocument(tokens, opts = {}) {
  const documentParser = setupDocumentParser();
  const frontMatterParser = setupFrontMatterParser(
    documentParser,
    opts?.defaultDocumentTitle || 'My Imported Movie',
  );
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
    if (
      token.type === 'section' ||
      token.type === 'synopsis' ||
      token.type === 'note'
    ) {
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
        if (token.forced && !token.style) {
          currentBlock.content = `!${token.text}`;
        } else {
          currentBlock.content = token.text;
        }
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
        currentShot = addShot(currentScene, currentBlock);
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

  // NOTE: Verify that all scenes have at least one block.
  for (let scene of Object.values(result.scenes)) {
    if (scene.blockIds.length <= 0) {
      let block = addBlock(scene);
      block.contentType = 'fountain-json';
      block.content = '';
    }
  }

  bakeFrontMatter();
  return result;
}

/**
 * @param {ReturnType<setupDocumentParser>} documentParser
 * @param {string} defaultDocumentTitle
 */
function setupFrontMatterParser(documentParser, defaultDocumentTitle) {
  // TODO: Title scenes (for now) will not be translated over. Let it die.
  // let titleScene = documentParser.addScene();
  let titleBlock = createBlock(); // documentParser.addBlock(titleScene);
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
    result.documentTitle = titleTitle || defaultDocumentTitle;
    result.settings.projectId = formatProjectId(result.documentTitle);
    result.revisionNumber = 1; // Reset to default.
  }

  return {
    addFrontMatterLine,
    bakeFrontMatter,
  };
}

function setupDocumentParser() {
  const store = createStore();
  const document = createDocument();
  const documentId = document.documentId;
  addDocument(store, document);

  function addSceneImpl() {
    let scene = createScene();
    addScene(store, documentId, scene);
    return scene;
  }

  /**
   * @param {import('@/stores/document/DocumentStore').Scene} scene
   */
  function addBlockImpl(scene) {
    let block = createBlock();
    addBlock(store, documentId, scene.sceneId, block);
    return block;
  }

  /**
   * @param {import('@/stores/document/DocumentStore').Scene} scene
   * @param {import('@/stores/document/DocumentStore').Block} block
   */
  function addShotImpl(scene, block) {
    let shot = createShot();
    addShot(store, documentId, scene.sceneId, block.blockId, shot);
    return shot;
  }

  return {
    store,
    document,
    addScene: addSceneImpl,
    addBlock: addBlockImpl,
    addShot: addShotImpl,
  };
}
