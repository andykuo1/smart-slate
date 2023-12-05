import { uuid } from '../utils/uuid';

/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createDocument>} Document
 * @typedef {ReturnType<createScene>} Scene
 * @typedef {ReturnType<createShot>} Shot
 * @typedef {ReturnType<createTake>} Take
 *
 * @typedef {string} DocumentId
 * @typedef {string} SceneId
 * @typedef {string} ShotId
 * @typedef {string} TakeId
 */

export function createStore() {
  return {
    /** @type {Record<DocumentId, Document>} */
    documents: {},
  };
}

/**
 * @param {DocumentId} documentId
 */
export function createDocument(documentId = uuid()) {
  return {
    documentId,
    revisionNumber: 0,
    /** @type {Array<SceneId>} */
    sceneOrder: [],
    /** @type {Record<SceneId, Scene>} */
    scenes: {},
    /** @type {Record<ShotId, Shot>} */
    shots: {},
    /** @type {Record<TakeId, Take>} */
    takes: {},
  };
}

/**
 * @param {SceneId} sceneId
 */
export function createScene(sceneId = uuid()) {
  return {
    sceneId,
    title: '',
    /** @type {Array<ShotId>} */
    shotIds: [],
  };
}

/**
 * @param {ShotId} shotId
 */
export function createShot(shotId = uuid()) {
  return {
    shotId,
    description: '',
    /** @type {Array<TakeId>} */
    takeIds: [],
  };
}

/**
 * @param {TakeId} takeId
 */
export function createTake(takeId = uuid()) {
  return {
    takeId,
    notes: '',
  };
}

/**
 * @param {Partial<Store>} out
 * @param {Store} store
 */
export function cloneStore(out, store) {
  if (typeof out.documents !== 'object') {
    out.documents = {};
  }
  for (let document of Object.values(store.documents)) {
    let outDocument =
      out?.documents[document.documentId] ||
      createDocument(document.documentId);
    let newDocument = cloneDocument(outDocument, document);
    out.documents[newDocument.documentId] = newDocument;
  }
  return out;
}

/**
 * @param {Partial<Document>} out
 * @param {Document} document
 */
export function cloneDocument(out, document) {
  out.documentId = document.documentId;
  out.revisionNumber = document.revisionNumber;
  out.sceneOrder = document.sceneOrder.slice();
  if (typeof out.scenes !== 'object') {
    out.scenes = {};
  }
  if (typeof out.shots !== 'object') {
    out.shots = {};
  }
  if (typeof out.takes !== 'object') {
    out.takes = {};
  }
  for (let scene of Object.values(document.scenes)) {
    let sceneId = scene.sceneId;
    let outScene = out?.scenes[sceneId] || createScene(sceneId);
    let newScene = cloneScene(outScene, scene);
    out.scenes[sceneId] = newScene;
  }
  for (let shot of Object.values(document.shots)) {
    let shotId = shot.shotId;
    let outShot = out?.shots[shotId] || createShot(shotId);
    let newShot = cloneShot(outShot, shot);
    out.shots[shotId] = newShot;
  }
  for (let take of Object.values(document.takes)) {
    let takeId = take.takeId;
    let outTake = out?.takes[takeId] || createTake(takeId);
    let newTake = cloneTake(outTake, take);
    out.takes[takeId] = newTake;
  }
  return out;
}

/**
 * @param {Partial<Scene>} out
 * @param {Scene} scene
 */
export function cloneScene(out, scene) {
  out.sceneId = scene.sceneId;
  out.shotIds = scene.shotIds.slice();
  out.title = scene.title;
  return out;
}

/**
 * @param {Partial<Shot>} out
 * @param {Shot} shot
 */
export function cloneShot(out, shot) {
  out.shotId = shot.shotId;
  out.description = shot.description;
  out.takeIds = shot.takeIds.slice();
  return out;
}

/**
 * @param {Partial<Take>} out
 * @param {Take} take
 */
export function cloneTake(out, take) {
  out.takeId = take.takeId;
  out.notes = take.notes;
  return out;
}
