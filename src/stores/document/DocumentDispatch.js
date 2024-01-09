import { zi } from '../ZustandImmerHelper';
import { createDispatchDocumentSettings } from './dispatch/DispatchDocumentSettings';
import {
  createDispatchDocuments,
  incrementDocumentRevisionNumber,
} from './dispatch/DispatchDocuments';
import { createDispatchShots } from './dispatch/DispatchShots';
import { createDispatchTakes } from './dispatch/DispatchTakes';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatch(set, get) {
  return {
    /** @type {() => import('./DocumentStore').Store} */
    UNSAFE_getStore: get,

    addDocument: zi(set, addDocument),
    addScene: zi(set, addScene),
    addBlock: zi(set, addBlock),
    addShot: zi(set, addShot),
    addTake: zi(set, addTake),

    deleteDocument: zi(set, deleteDocument),
    deleteScene: zi(set, deleteScene),
    deleteBlock: zi(set, deleteBlock),
    deleteShot: zi(set, deleteShot),
    deleteTake: zi(set, deleteTake),

    ...createDispatchDocuments(set, get),
    ...createDispatchDocumentSettings(set, get),
    ...createDispatchShots(set, get),
    ...createDispatchTakes(set, get),
  };
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').Document} document
 */
export function addDocument(store, document) {
  store.documents[document.documentId] = document;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').Scene} scene
 */
export function addScene(store, documentId, scene) {
  let document = store.documents[documentId];
  document.scenes[scene.sceneId] = scene;
  document.sceneOrder.push(scene.sceneId);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 * @param {import('./DocumentStore').Block} block
 */
export function addBlock(store, documentId, sceneId, block) {
  let document = store.documents[documentId];
  let scene = document.scenes[sceneId];
  document.blocks[block.blockId] = block;
  scene.blockIds.push(block.blockId);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').BlockId} blockId
 * @param {import('./DocumentStore').Shot} shot
 */
export function addShot(store, documentId, blockId, shot) {
  let document = store.documents[documentId];
  let block = document.blocks[blockId];
  document.shots[shot.shotId] = shot;
  block.shotIds.push(shot.shotId);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {import('./DocumentStore').Take} take
 */
export function addTake(store, documentId, shotId, take) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  document.takes[take.takeId] = take;
  shot.takeIds.push(take.takeId);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function deleteDocument(store, documentId) {
  let document = store.documents[documentId];
  delete store.documents[documentId];
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
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
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').BlockId} blockId
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
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
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
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').TakeId} takeId
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
