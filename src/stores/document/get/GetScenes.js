import { getDocumentById } from './GetDocuments';

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getSceneById(store, documentId, sceneId) {
  return store?.documents?.[documentId]?.scenes[sceneId];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function getSceneIdsInOrder(store, documentId) {
  return getDocumentById(store, documentId)?.sceneOrder || [];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getSceneNumber(store, documentId, sceneId) {
  const index = Number(
    getDocumentById(store, documentId)?.sceneOrder?.indexOf?.(sceneId),
  );
  if (index < 0) {
    return -1;
  }
  return index + 1;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function findSceneWithBlockId(store, documentId, blockId) {
  if (!blockId) {
    return null;
  }
  const document = getDocumentById(store, documentId);
  for (let scene of Object.values(document?.scenes || {})) {
    if (scene?.blockIds?.includes?.(blockId)) {
      return scene;
    }
  }
  return null;
}
