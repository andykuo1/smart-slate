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
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').SceneId} sceneId
 * @param {import('../DocumentStore').BlockId} blockId
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
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').SceneId} sceneId
 */
export function getFirstBlockIdInScene(store, documentId, sceneId) {
  return getSceneById(store, documentId, sceneId)?.blockIds?.[0] || '';
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
