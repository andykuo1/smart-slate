/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function getDocumentSettingsById(store, documentId) {
  return store?.documents?.[documentId]?.settings;
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function getDocumentById(store, documentId) {
  return store?.documents?.[documentId];
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 */
export function getSceneById(store, documentId, sceneId) {
  return store?.documents?.[documentId]?.scenes[sceneId];
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').BlockId} blockId
 */
export function getBlockById(store, documentId, blockId) {
  return store?.documents?.[documentId]?.blocks[blockId];
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function getShotById(store, documentId, shotId) {
  return store?.documents?.[documentId]?.shots[shotId];
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function getTakeById(store, documentId, takeId) {
  return store?.documents?.[documentId]?.takes[takeId];
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 */
export function getSceneIndex(store, documentId, sceneId) {
  return store?.documents?.[documentId]?.sceneOrder.indexOf(sceneId) + 1;
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 * @param {import('./DocumentStore').BlockId} blockId
 */
export function getBlockIndex(store, documentId, sceneId, blockId) {
  return (
    getSceneById(store, documentId, sceneId)?.blockIds.indexOf(blockId) + 1
  );
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function getShotIndex(store, documentId, sceneId, shotId) {
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
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function getTakeIndex(store, documentId, shotId, takeId) {
  return getShotById(store, documentId, shotId)?.takeIds?.indexOf(takeId) + 1;
}

/**
 * @param {import('./DocumentStore').Store} store
 */
export function getDocumentIds(store) {
  return Object.keys(store.documents);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function getSceneIdsInOrder(store, documentId) {
  return getDocumentById(store, documentId)?.sceneOrder || [];
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 */
export function getBlockIdsInOrder(store, documentId, sceneId) {
  return getSceneById(store, documentId, sceneId)?.blockIds || [];
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').BlockId} blockId
 */
export function getShotIdsInOrder(store, documentId, blockId) {
  return getBlockById(store, documentId, blockId)?.shotIds || [];
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function getTakeIdsInOrder(store, documentId, shotId) {
  return getShotById(store, documentId, shotId)?.takeIds || [];
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 */
export function getFirstSceneBlockId(store, documentId, sceneId) {
  return getSceneById(store, documentId, sceneId).blockIds[0] || '';
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
