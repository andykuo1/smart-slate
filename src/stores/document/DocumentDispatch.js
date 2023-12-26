import { zi } from '../ZustandImmerHelper';
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
    addShot: zi(set, addShot),
    addTake: zi(set, addTake),

    deleteDocument: zi(set, deleteDocument),
    deleteScene: zi(set, deleteScene),
    deleteShot: zi(set, deleteShot),
    deleteTake: zi(set, deleteTake),

    ...createDispatchDocuments(set, get),
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
 * @param {import('./DocumentStore').Shot} shot
 */
export function addShot(store, documentId, sceneId, shot) {
  let document = store.documents[documentId];
  let scene = document.scenes[sceneId];
  document.shots[shot.shotId] = shot;
  scene.shotIds.push(shot.shotId);
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
  // Remove shots from scene
  let oldShots = scene.shotIds;
  scene.shotIds = [];
  for (let shotId of oldShots) {
    deleteShot(store, documentId, shotId);
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
  // Remove from any scene referencing this shot
  for (let { shotIds } of Object.values(document.scenes)) {
    let i = shotIds.indexOf(shotId);
    if (i >= 0) {
      shotIds.splice(i, 1);
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
