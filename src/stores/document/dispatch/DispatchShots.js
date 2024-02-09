import { zi } from '@/stores/ZustandImmerHelper';

import {
  findSceneWithBlockId,
  getBlockById,
  getLastBlockIdInScene,
  getOffsetBlockIdWithShotsInScene,
  getSceneById,
  getShotById,
  isShotEmpty,
} from '../get';
import { incrementDocumentRevisionNumber } from './DispatchDocuments';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchShots(set, get) {
  return {
    setShotType: zi(set, setShotType),
    setShotDescription: zi(set, setShotDescription),
    setShotReferenceImage: zi(set, setShotReferenceImage),
    setShotNumber: zi(set, setShotNumber),
    updateShot: zi(set, updateShot),
    moveShot: zi(set, moveShot),
    moveShotToScene: zi(set, moveShotToScene),
    moveShotToBlock: zi(set, moveShotToBlock),
    moveShotUp: zi(set, moveShotUp),
    moveShotDown: zi(set, moveShotDown),
    renumberShots: zi(set, renumberShots),
  };
}

/**
 * @callback UpdateShotHandler
 * @param {import('@/stores/document/DocumentStore').Shot} shot
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').Store} store
 */

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {UpdateShotHandler} handler
 */
function updateShot(store, documentId, shotId, handler) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  handler(shot, shotId, documentId, store);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {string} shotType
 */
function setShotType(store, documentId, shotId, shotType) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.shotType = shotType;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {string} description
 */
function setShotDescription(store, documentId, shotId, description) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.description = description;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {string} referenceImageUrl
 */
function setShotReferenceImage(store, documentId, shotId, referenceImageUrl) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.referenceImage = referenceImageUrl;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {number} shotNumber
 */
function setShotNumber(store, documentId, shotId, shotNumber) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.shotNumber = shotNumber;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').ShotId} targetId
 * @param {boolean} [before]
 */
function moveShot(
  store,
  documentId,
  blockId,
  shotId,
  targetId,
  before = false,
) {
  const document = store.documents[documentId];
  const block = document.blocks[blockId];
  const shotIds = block.shotIds;
  const shotIndex = shotIds.indexOf(shotId);
  if (shotIndex < 0) {
    return;
  }
  if (shotIds.length <= 0) {
    return;
  }
  shotIds.splice(shotIndex, 1);
  const targetIndex = shotIds.indexOf(targetId);
  if (before) {
    shotIds.splice(targetIndex, 0, shotId);
  } else if (targetIndex + 1 < block.shotIds.length) {
    shotIds.splice(targetIndex + 1, 0, shotId);
  } else {
    shotIds.push(shotId);
  }
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').BlockId} targetBlockId
 * @param {import('@/stores/document/DocumentStore').ShotId} targetShotId
 * @param {boolean} [before]
 */
function moveShotToBlock(
  store,
  documentId,
  blockId,
  shotId,
  targetBlockId,
  targetShotId,
  before = false,
) {
  // Can only move shots within the same scene...
  const scene = findSceneWithBlockId(store, documentId, blockId);
  const targetScene = findSceneWithBlockId(store, documentId, targetBlockId);
  if (scene !== targetScene) {
    return;
  }
  const document = store.documents[documentId];
  const block = document.blocks[blockId];
  const shotIds = block.shotIds;
  const shotIndex = shotIds.indexOf(shotId);
  if (shotIndex < 0) {
    return;
  }
  if (shotIds.length <= 0) {
    return;
  }
  shotIds.splice(shotIndex, 1);

  const targetBlock = document.blocks[targetBlockId];
  const targetShotIds = targetBlock.shotIds;
  const targetShotIndex = targetShotIds.indexOf(targetShotId);
  if (before) {
    targetShotIds.splice(targetShotIndex, 0, shotId);
  } else if (targetShotIndex + 1 < targetBlock.shotIds.length) {
    targetShotIds.splice(targetShotIndex + 1, 0, shotId);
  } else {
    targetShotIds.push(shotId);
  }
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').SceneId} targetSceneId
 */
function moveShotToScene(store, documentId, blockId, shotId, targetSceneId) {
  const document = store.documents[documentId];
  const block = document.blocks[blockId];
  const shotIds = block.shotIds;
  const shotIndex = shotIds.indexOf(shotId);
  const targetBlockId = getLastBlockIdInScene(store, documentId, targetSceneId);
  const targetBlock = getBlockById(store, documentId, targetBlockId);
  if (shotIndex < 0) {
    return;
  }
  if (shotIds.length <= 0) {
    return;
  }
  shotIds.splice(shotIndex, 1);
  targetBlock.shotIds.push(shotId);

  // Rename shot number
  const targetShot = getShotById(store, documentId, shotId);
  const targetScene = getSceneById(store, documentId, targetSceneId);
  const shotNumber = targetScene.nextShotNumber;
  targetScene.nextShotNumber += 1;
  targetShot.shotNumber = shotNumber;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
function moveShotUp(store, documentId, sceneId, blockId, shotId) {
  const document = store.documents[documentId];
  if (!document) {
    // No document. Skip it.
    return;
  }
  const block = document.blocks[blockId];
  if (!block) {
    // No block. Skip it.
    return;
  }

  const shotIds = block.shotIds;
  const shotIndex = shotIds.indexOf(shotId);
  if (shotIndex < 0) {
    // Shot not found in block. Skip it.
    return;
  }

  let targetBlockId = blockId;
  let targetBlock = block;
  let targetShotIds = shotIds;
  let targetShotIndex = shotIndex - 1;
  if (targetShotIndex < 0) {
    // ...get prev block
    let prevBlockId = getOffsetBlockIdWithShotsInScene(
      store,
      documentId,
      sceneId,
      targetBlockId,
      -1,
    );
    if (!prevBlockId) {
      // No valid block to put this in.
      return;
    }
    targetBlockId = prevBlockId;
    targetBlock = getBlockById(store, documentId, targetBlockId);
    targetShotIds = targetBlock.shotIds;
    // ...past this block into the prev
    targetShotIndex = targetShotIds.length;
  }
  // Remove the original...
  shotIds.splice(shotIndex, 1);
  // ... and add it in the new place!
  targetShotIds.splice(targetShotIndex, 0, shotId);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
function moveShotDown(store, documentId, sceneId, blockId, shotId) {
  const document = store.documents[documentId];
  if (!document) {
    // No document. Skip it.
    return;
  }
  const block = document.blocks[blockId];
  if (!block) {
    // No block. Skip it.
    return;
  }

  const shotIds = block.shotIds;
  const shotIndex = shotIds.indexOf(shotId);
  if (shotIndex < 0) {
    // Shot not found in block. Skip it.
    return;
  }

  let targetBlockId = blockId;
  let targetBlock = block;
  let targetShotIds = shotIds;
  let targetShotIndex = shotIndex + 1;
  if (targetShotIndex >= targetShotIds.length) {
    // ...get next block
    let nextBlockId = getOffsetBlockIdWithShotsInScene(
      store,
      documentId,
      sceneId,
      targetBlockId,
      1,
    );
    if (!nextBlockId) {
      // No valid block to put this in.
      return;
    }
    targetBlockId = nextBlockId;
    targetBlock = getBlockById(store, documentId, targetBlockId);
    targetShotIds = targetBlock?.shotIds;
    // ...past this block into the next
    targetShotIndex = 0;
  }
  // Remove the original...
  shotIds.splice(shotIndex, 1);
  // ... and add it in the new place!
  targetShotIds.splice(targetShotIndex, 0, shotId);
}

const MAX_ITERATIONS = 1_000;

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {boolean} [emptyOnly]
 */
function renumberShots(store, documentId, sceneId, emptyOnly = true) {
  let scene = getSceneById(store, documentId, sceneId);
  // Get all used numbers so we can avoid them...
  /** @type {Array<number>} */
  let usedNumbers = [];
  if (emptyOnly) {
    for (let blockId of scene.blockIds) {
      let block = getBlockById(store, documentId, blockId);
      for (let shotId of block.shotIds) {
        if (!isShotEmpty(store, documentId, shotId)) {
          let shot = getShotById(store, documentId, shotId);
          if (shot) {
            usedNumbers.push(shot.shotNumber);
          }
        }
      }
    }
  }
  // Actually change the scene number...
  scene.nextShotNumber = 1;
  for (let blockId of scene.blockIds) {
    let block = getBlockById(store, documentId, blockId);
    for (let shotId of block.shotIds) {
      if (emptyOnly && !isShotEmpty(store, documentId, shotId)) {
        continue;
      }
      // ...but make sure it's a valid number...
      let shotNumber = nextAvailableShotNumber(scene, usedNumbers);
      let shot = getShotById(store, documentId, shotId);
      shot.shotNumber = shotNumber;
      usedNumbers.push(shotNumber);
    }
  }
}

/**
 * @param {import('@/stores/document/DocumentStore').Scene} scene
 * @param {Array<number>} used
 */
function nextAvailableShotNumber(scene, used) {
  for (let i = 0; i < MAX_ITERATIONS; ++i) {
    let result = scene.nextShotNumber;
    if (!used.includes(result)) {
      return result;
    } else {
      scene.nextShotNumber += 1;
    }
  }
  throw new Error(
    '[DispatchShots] Failed to find valid shot number within ' +
      MAX_ITERATIONS +
      ' steps.',
  );
}
