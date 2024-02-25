import { getDocumentById } from './GetDocuments';
import { findSceneWithBlockId, getSceneById } from './GetScenes';

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function getBlockById(store, documentId, blockId) {
  return store?.documents?.[documentId]?.blocks[blockId];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getBlockIdsInOrder(store, documentId, sceneId) {
  return getSceneById(store, documentId, sceneId)?.blockIds || [];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function getBlockOrder(store, documentId, sceneId, blockId) {
  const index = Number(
    getSceneById(store, documentId, sceneId)?.blockIds?.indexOf?.(blockId),
  );
  if (index < 0) {
    return -1;
  }
  return index + 1;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getFirstBlockIdInScene(store, documentId, sceneId) {
  return getSceneById(store, documentId, sceneId)?.blockIds?.[0] || '';
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getLastBlockIdInScene(store, documentId, sceneId) {
  let result = getSceneById(store, documentId, sceneId)?.blockIds;
  if (!result || result.length <= 0) {
    return '';
  }
  return result[result.length - 1];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {number} [offset]
 */
export function getOffsetBlockIdInScene(
  store,
  documentId,
  sceneId,
  blockId,
  offset = 1,
) {
  let result = getSceneById(store, documentId, sceneId)?.blockIds;
  if (!result || result.length <= 0) {
    return '';
  }
  let index = result.indexOf(blockId);
  let nextIndex = index + offset;
  if (nextIndex < 0 || nextIndex >= result.length) {
    return '';
  }
  return result[nextIndex];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {number} [offset]
 */
export function getOffsetBlockIdWithShotsInScene(
  store,
  documentId,
  sceneId,
  blockId,
  offset = 1,
) {
  if (offset === 0) {
    throw new Error('Cannot get 0 offset for block id with shots in scene.');
  }
  let result = getSceneById(store, documentId, sceneId)?.blockIds;
  if (!result || result.length <= 0) {
    return '';
  }
  let index = result.indexOf(blockId);
  let nextIndex = index + offset;
  if (nextIndex < 0 || nextIndex >= result.length) {
    return '';
  }
  while (nextIndex >= 0 && nextIndex < result.length) {
    let nextBlockId = result[nextIndex];
    let shotCount = getBlockById(store, documentId, nextBlockId)?.shotIds
      ?.length;
    if (shotCount > 0) {
      return nextBlockId;
    }
    nextIndex += offset;
  }
  return '';
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function findBlockWithShotId(store, documentId, shotId) {
  if (!shotId) {
    return null;
  }
  const document = getDocumentById(store, documentId);
  for (let block of Object.values(document?.blocks || {})) {
    if (block?.shotIds?.includes?.(shotId)) {
      return block;
    }
  }
  return null;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function isBlockEmpty(store, documentId, blockId) {
  if (!blockId) {
    return true;
  }
  const block = getBlockById(store, documentId, blockId);
  if (!block) {
    return true;
  }
  if (block.shotIds.length > 0) {
    return false;
  }
  if (block.content) {
    return false;
  }
  return true;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {import('@/stores/document/DocumentStore').BlockId} otherBlockId
 */
export function isBlockInSameScene(store, documentId, blockId, otherBlockId) {
  if (!blockId || !otherBlockId) {
    return false;
  }
  const scene = findSceneWithBlockId(store, documentId, blockId);
  if (!scene) {
    return false;
  }
  return scene.blockIds.includes(otherBlockId);
}
