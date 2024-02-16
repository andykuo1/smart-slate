import { zi } from '@/stores/ZustandImmerHelper';

import { incrementDocumentRevisionNumber } from './DispatchDocuments';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchAddDelete(set, get) {
  return {
    addDocument: zi(set, addDocument),
    addScene: zi(set, addScene),
    addBlock: zi(set, addBlock),
    addShot: zi(set, addShot),
    addTake: zi(set, addTake),

    putPotentiallyOrphanedBlocks: zi(set, putPotentiallyOrphanedBlocks),

    deleteDocument: zi(set, deleteDocument),
    deleteScene: zi(set, deleteScene),
    deleteBlock: zi(set, deleteBlock),
    deleteShot: zi(set, deleteShot),
    deleteTake: zi(set, deleteTake),
  };
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').Document} document
 */
export function addDocument(store, document) {
  store.documents[document.documentId] = document;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').Scene} scene
 */
export function addScene(store, documentId, scene) {
  let document = store.documents[documentId];
  document.scenes[scene.sceneId] = scene;

  let sceneNumber = document.nextSceneNumber;
  document.nextSceneNumber += 1;
  scene.sceneNumber = sceneNumber;

  document.sceneOrder.push(scene.sceneId);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {Array<import('@/stores/document/DocumentStore').Block>} blocks
 */
export function putPotentiallyOrphanedBlocks(store, documentId, blocks) {
  let document = store.documents[documentId];
  for (let block of blocks) {
    document.blocks[block.blockId] = block;
  }
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').Block} block
 * @param {number} [blockOrder]
 */
export function addBlock(store, documentId, sceneId, block, blockOrder = -1) {
  let document = store.documents[documentId];
  let scene = document.scenes[sceneId];
  document.blocks[block.blockId] = block;
  if (blockOrder >= 0) {
    scene.blockIds.splice(blockOrder, 0, block.blockId);
  } else {
    scene.blockIds.push(block.blockId);
  }
  if (!block.contentType) {
    block.contentType = 'fountain-json';
  }
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {import('@/stores/document/DocumentStore').Shot} shot
 */
export function addShot(store, documentId, sceneId, blockId, shot) {
  let document = store.documents[documentId];
  document.shots[shot.shotId] = shot;

  let scene = document.scenes[sceneId];
  let shotNumber = scene.nextShotNumber;
  scene.nextShotNumber += 1;
  shot.shotNumber = shotNumber;

  let block = document.blocks[blockId];
  block.shotIds.push(shot.shotId);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').Take} take
 */
export function addTake(store, documentId, shotId, take) {
  let document = store.documents[documentId];
  document.takes[take.takeId] = take;

  let shot = document.shots[shotId];
  let takeNumber = shot.nextTakeNumber;
  shot.nextTakeNumber += 1;
  take.takeNumber = takeNumber;

  shot.takeIds.push(take.takeId);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function deleteDocument(store, documentId) {
  let document = store.documents[documentId];
  delete store.documents[documentId];
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function deleteScene(store, documentId, sceneId) {
  let document = store.documents[documentId];
  let scene = document.scenes[sceneId];
  // Remove blocks from scene
  let oldBlocks = scene.blockIds;
  scene.blockIds = [];
  for (let blockId of oldBlocks) {
    deleteBlock(store, documentId, blockId);
  }
  // Remove from sceneOrder
  let i = document.sceneOrder.indexOf(sceneId);
  document.sceneOrder.splice(i, 1);
  // Remove from document
  delete document.scenes[sceneId];
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function deleteBlock(store, documentId, blockId) {
  let document = store.documents[documentId];
  let block = document.blocks[blockId];
  // Remove shots from block
  let oldShots = block.shotIds;
  block.shotIds = [];
  for (let shotId of oldShots) {
    deleteShot(store, documentId, shotId);
  }
  // Remove from any scene referencing this block
  for (let { blockIds } of Object.values(document.scenes)) {
    let i = blockIds.indexOf(blockId);
    if (i >= 0) {
      blockIds.splice(i, 1);
    }
  }
  // Remove from document
  delete document.blocks[blockId];
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function deleteShot(store, documentId, shotId) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  // Remove takes from shot
  let oldTakes = shot.takeIds;
  shot.takeIds = [];
  for (let takeId of oldTakes) {
    deleteTake(store, documentId, takeId);
  }
  // Remove from any block referencing this shot
  for (let { shotIds } of Object.values(document.blocks)) {
    let i = shotIds.indexOf(shotId);
    if (i >= 0) {
      shotIds.splice(i, 1);
    }
  }
  // Remove assigned shot hash from document
  if (shot.shotHash) {
    let oldShotHash = shot.shotHash;
    shot.shotHash = '';
    let i = document.shotHashes.indexOf(oldShotHash);
    if (i >= 0) {
      document.shotHashes.splice(i, 1);
    }
  }
  // Remove from document
  delete document.shots[shotId];
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export function deleteTake(store, documentId, takeId) {
  let document = store.documents[documentId];
  // Remove from any shot referencing this take
  for (let { takeIds } of Object.values(document.shots)) {
    let i = takeIds.indexOf(takeId);
    if (i >= 0) {
      takeIds.splice(i, 1);
    }
  }
  // Remove from document
  delete document.takes[takeId];
  incrementDocumentRevisionNumber(document);
}
