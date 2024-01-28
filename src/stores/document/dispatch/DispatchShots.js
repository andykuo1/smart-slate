import { zi } from '@/stores/ZustandImmerHelper';

import {
  getBlockById,
  getLastBlockIdInScene,
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
    moveShot: zi(set, moveShot),
    updateShot: zi(set, updateShot),
    moveShotToScene: zi(set, moveShotToScene),
    moveShotBy: zi(set, moveShotBy),
    reorderShots: zi(set, reorderShots),
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
 * @param {number} offset
 */
function moveShotBy(store, documentId, sceneId, blockId, shotId, offset) {
  throw new Error('Not yet implemented.');
  /*
  const document = store.documents[documentId];
  const scene = document.scenes[sceneId];
  const block = document.blocks[blockId];
  const shot = document.shots[shotId];
  const shotIds = block.shotIds;
  const shotIndex = shotIds.indexOf(shotId);
  if (shotIndex < 0) {
    // Shot not found in block. Skip it.
    return;
  }
  if (offset > 0) {
    // Moving shot forward....
    let targetBlockId = blockId;
    let targetBlock = block;
    let targetShotIds = shotIds;
    let targetShotIndex = shotIndex + offset;
    while (targetShotIndex > targetShotIds.length) {
      // ...past this block into the next
      targetShotIndex -= targetShotIds.length;
      // ...get next block
      let nextBlockId = getNextBlockIdInScene(
        store,
        documentId,
        sceneId,
        targetBlockId,
        1,
      );
      if (!nextBlockId) {
        break;
      }
      targetBlockId = nextBlockId;
      targetBlock = getBlockById(store, documentId, targetBlockId);
      targetShotIds = targetBlock.shotIds;
    }
    // Add it in!
    targetShotIds.splice(targetShotIndex, 0, shotId);
  } else {
    // Moving shot backward...
    let targetBlockId = blockId;
    let targetBlock = block;
    let targetShotIds = shotIds;
    let targetShotIndex = shotIndex + offset;
    while (targetShotIndex < 0) {
      // ...before this block into the previous
      targetShotIndex += targetShotIds.length;
      // ...get previous block
    }
  }

  const targetBlockId = getLastBlockIdInScene(store, documentId);
  const targetBlock = getBlockById(store, documentId, targetBlockId);
  if (shotIndex < 0) {
    return;
  }
  if (shotIds.length <= 0) {
    return;
  }
  shotIds.splice(shotIndex, 1);
  targetBlock.shotIds.push(shotId);
  */
}

const MAX_ITERATIONS = 1_000;

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {boolean} [emptyOnly]
 */
function reorderShots(store, documentId, sceneId, emptyOnly = true) {
  let scene = getSceneById(store, documentId, sceneId);
  scene.nextShotNumber = 1;
  // Get all used numbers so we can avoid them...
  /** @type {Array<number>} */
  let usedNumbers = [];
  if (emptyOnly) {
    for (let blockId of scene.blockIds) {
      let block = getBlockById(store, documentId, blockId);
      for (let shotId of block.shotIds) {
        if (!isShotEmpty(store, documentId, shotId)) {
          let shot = getShotById(store, documentId, shotId);
          usedNumbers.push(shot.shotNumber);
        }
      }
    }
  }
  // Actually change the scene number...
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
