import { getBlockById, isBlockEmpty } from './GetBlocks';
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
export function getSceneOrder(store, documentId, sceneId) {
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

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function findSceneWithShotId(store, documentId, shotId) {
  if (!shotId) {
    return null;
  }
  const document = getDocumentById(store, documentId);
  for (let scene of Object.values(document?.scenes || {})) {
    for (let blockId of scene.blockIds) {
      let block = getBlockById(store, documentId, blockId);
      if (block.shotIds.includes(shotId)) {
        return scene;
      }
    }
  }
  return null;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function isSceneEmpty(store, documentId, sceneId) {
  if (!sceneId) {
    return true;
  }
  const scene = getSceneById(store, documentId, sceneId);
  if (!scene) {
    return true;
  }
  for (let blockId of scene.blockIds) {
    if (!isBlockEmpty(store, documentId, blockId)) {
      return false;
    }
  }
  return true;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getSceneShotCount(store, documentId, sceneId) {
  const scene = getSceneById(store, documentId, sceneId);
  if (!scene) {
    return 0;
  }
  let result = 0;
  for (let blockId of scene.blockIds) {
    let block = getBlockById(store, documentId, blockId);
    if (!block) {
      continue;
    }
    result += block.shotIds.length;
  }
  return result;
}
