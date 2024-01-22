import { getDocumentById } from './GetDocuments';
import { getSceneById } from './GetScenes';

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
export function getBlockIndex(store, documentId, sceneId, blockId) {
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
export function getNextBlockIdInScene(
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
