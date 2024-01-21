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
export function getShotIdsInOrder(store, documentId, blockId) {
  return getBlockById(store, documentId, blockId)?.shotIds || [];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function getShotNumber(store, documentId, sceneId, shotId) {
  const scene = getSceneById(store, documentId, sceneId);
  const blockIds = scene?.blockIds;
  if (!blockIds) {
    return -1;
  }
  // TODO: This doesn't respect block order!
  let outOfBlocks = true;
  let currentIndex = 0;
  for (let blockId of blockIds) {
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
