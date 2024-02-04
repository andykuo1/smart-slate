import { getBlockById } from './GetBlocks';
import { getDocumentById } from './GetDocuments';
import { getSceneById } from './GetScenes';

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function getShotById(store, documentId, shotId) {
  return store?.documents?.[documentId]?.shots[shotId];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function getShotIdsInBlockOrder(store, documentId, blockId) {
  return getBlockById(store, documentId, blockId)?.shotIds || [];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getShotIdsInSceneOrder(store, documentId, sceneId) {
  /** @type {Array<import('@/stores/document/DocumentStore').ShotId>} */
  let result = [];
  let scene = getSceneById(store, documentId, sceneId);
  if (!scene) {
    return result;
  }
  for (let blockId of scene.blockIds) {
    let block = getBlockById(store, documentId, blockId);
    if (block?.shotIds?.length > 0) {
      result.push(...block.shotIds);
    }
  }
  return result;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function getFirstEmptyShotInDocument(store, documentId) {
  let document = getDocumentById(store, documentId);
  let lastSceneId = '';
  let lastBlockId = '';
  let lastShotId = '';
  for (let sceneId of document.sceneOrder) {
    lastSceneId = sceneId;
    lastBlockId = '';
    lastShotId = '';
    let scene = getSceneById(store, documentId, sceneId);
    for (let blockId of scene.blockIds) {
      lastBlockId = blockId;
      lastShotId = '';
      let block = getBlockById(store, documentId, blockId);
      for (let shotId of block.shotIds) {
        lastShotId = shotId;
        if (isShotEmpty(store, documentId, shotId)) {
          return { documentId, sceneId, blockId, shotId };
        }
      }
    }
  }
  return {
    documentId,
    sceneId: lastSceneId,
    blockId: lastBlockId,
    shotId: lastShotId,
  };
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getFirstEmptyShotInScene(store, documentId, sceneId) {
  let scene = getSceneById(store, documentId, sceneId);
  let lastBlockId = '';
  let lastShotId = '';
  for (let blockId of scene.blockIds) {
    lastBlockId = blockId;
    lastShotId = '';
    let block = getBlockById(store, documentId, blockId);
    for (let shotId of block.shotIds) {
      lastShotId = shotId;
      if (isShotEmpty(store, documentId, shotId)) {
        return { documentId, sceneId, blockId, shotId };
      }
    }
  }
  return {
    documentId,
    sceneId,
    blockId: lastBlockId,
    shotId: lastShotId,
  };
}
/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function getShotOrder(store, documentId, sceneId, shotId) {
  const scene = getSceneById(store, documentId, sceneId);
  if (!scene) {
    return -1;
  }
  // TODO: This doesn't respect block order...yet?
  let outOfBlocks = true;
  let currentIndex = 0;
  for (let blockId of scene.blockIds) {
    const block = getBlockById(store, documentId, blockId);
    const index = block.shotIds.indexOf(shotId);
    if (index >= 0) {
      currentIndex += index;
      outOfBlocks = false;
      break;
    } else {
      currentIndex += block.shotIds.length;
    }
  }
  if (outOfBlocks) {
    return -1;
  }
  return currentIndex + 1;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export function findShotWithTakeId(store, documentId, takeId) {
  if (!takeId) {
    return null;
  }
  const document = getDocumentById(store, documentId);
  for (let shot of Object.values(document?.shots || {})) {
    if (shot?.takeIds?.includes?.(takeId)) {
      return shot;
    }
  }
  return null;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotHash} shotHash
 */
export function findShotWithShotHash(store, documentId, shotHash) {
  const document = getDocumentById(store, documentId);
  for (let shot of Object.values(document?.shots || {})) {
    if (shot.shotHash === shotHash) {
      return shot;
    }
  }
  return null;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function isShotEmpty(store, documentId, shotId) {
  return getShotById(store, documentId, shotId)?.takeIds?.length <= 0;
}
