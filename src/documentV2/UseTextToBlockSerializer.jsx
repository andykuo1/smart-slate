import { useCallback, useState } from 'react';

import { parse } from '@/fountain/FountainParser';
import { fountainToDocument } from '@/serdes/FountainToDocumentParser';
import {
  getBlockById,
  getBlockOrder,
  getSceneById,
  useAddBlock,
  useAddScene,
} from '@/stores/document';
import { createBlock } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {string} text
 * @param {import('@/stores/document/DocumentStore').BlockContentStyle} type
 */
export function useFormattedTextState(text, type) {
  return useState(formatTextWithOverrides(text, type));
}

export function useTextToBlockSerializer() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setBlockContent = useDocumentStore((ctx) => ctx.setBlockContent);
  const deleteBlock = useDocumentStore((ctx) => ctx.deleteBlock);
  const addBlock = useAddBlock();
  const addScene = useAddScene();

  const putPotentiallyOrphanedBlocks = useDocumentStore(
    (ctx) => ctx.putPotentiallyOrphanedBlocks,
  );

  const serializeTextToBlock = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').BlockId} blockId
     * @param {string} newText
     * @param {boolean} allowScenes
     */
    function serializeTextToBlock(
      documentId,
      sceneId,
      blockId,
      newText,
      allowScenes,
    ) {
      let store = UNSAFE_getStore();
      let { currentBlocks, newBlocks, newScenes } = parseTextToBlocks(
        newText,
        allowScenes,
      );

      // ... for the current block
      let firstBlock = currentBlocks.shift();
      if (!firstBlock) {
        // Delete this block if it's empty.
        setBlockContent(documentId, blockId, 'fountain-json', '');
        let block = getBlockById(store, documentId, blockId);
        if (block.shotIds.length <= 0) {
          deleteBlock(documentId, blockId);
        }
        return;
      }
      let blockOrder = getBlockOrder(store, documentId, sceneId, blockId);
      setBlockContent(
        documentId,
        blockId,
        'fountain-json',
        firstBlock.content ?? '',
        firstBlock.contentStyle,
      );

      // ... for any added current blocks
      if (currentBlocks.length > 0) {
        let currentIndex = blockOrder - 1;
        for (let block of currentBlocks) {
          addBlock(documentId, sceneId, block, ++currentIndex);
        }
      }

      // ... for any new blocks
      if (newBlocks.length > 0) {
        // NOTE: We trust the parser results to NEVER orphan blocks.
        putPotentiallyOrphanedBlocks(documentId, newBlocks);
      }

      // ... for any new scenes
      for (let scene of newScenes) {
        addScene(documentId, scene);
      }
    },
    [
      UNSAFE_getStore,
      setBlockContent,
      deleteBlock,
      addBlock,
      addScene,
      putPotentiallyOrphanedBlocks,
    ],
  );

  return serializeTextToBlock;
}

const FIRST_SCENE_HEADING = '__CURRENT_SCENE__';

/**
 * @param {string} text
 * @param {boolean} allowScenes
 */
function parseTextToBlocks(text, allowScenes) {
  let preparedText = `.${FIRST_SCENE_HEADING}\n\n${text}`;
  let parsed = parse(preparedText);
  let tempDocument = fountainToDocument(parsed.tokens);
  let tempDocumentId = tempDocument.documentId;
  let tempStore = {
    documents: { [tempDocumentId]: tempDocument },
  };
  let currentBlocks = [];
  let newBlocks = [];
  let newScenes = [];
  // NOTE: We do not allow scenes while writing in blocks. So
  //  scene tokens should be converted to just text.
  //  ... we also do not allow shots.
  for (let sceneId of tempDocument.sceneOrder) {
    let scene = getSceneById(tempStore, tempDocumentId, sceneId);
    if (scene.sceneHeading === FIRST_SCENE_HEADING) {
      for (let blockId of scene.blockIds) {
        currentBlocks.push(tempDocument.blocks[blockId]);
      }
      continue;
    }
    if (allowScenes) {
      // This is expected scene header. Make it a new scene and add its blocks.
      // ...and add all content blocks to the result store.
      for (let blockId of scene.blockIds) {
        let block = getBlockById(tempStore, tempDocumentId, blockId);
        newBlocks.push(block);
      }
      newScenes.push(scene);
      continue;
    }
    // This is unexpected scene header. Make it a text block.
    let block = createBlock();
    block.content = `!${scene.sceneHeading}`;
    block.contentType = 'fountain-json';
    block.contentStyle = 'action';
    currentBlocks.push(block);
  }
  return {
    currentBlocks,
    newBlocks,
    newScenes,
  };
}

/**
 * @param {string} text
 * @param {import('@/stores/document/DocumentStore').BlockContentStyle} style
 */
function formatTextWithOverrides(text, style) {
  switch (style) {
    case 'centered':
      return `>${text}<`;
    case 'lyric':
      return `~${text}`;
    case 'note':
      return `[[${text}]]`;
    case 'transition':
      if (text.endsWith('TO:')) {
        return text;
      }
      return `>${text}`;
    case 'dialogue':
    case 'action':
    default:
      return text;
  }
}
