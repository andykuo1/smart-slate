import { uuid } from '@/utils/uuid';

import ShotTypes, { ANY_SHOT } from './ShotTypes';

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
 *
 * @typedef {'wide'|'medium'|'closeup'|'full'|'long'|''} ShotType
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
    documentTitle: '',
    lastUpdatedMillis: 0,
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
    sceneName: '',
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
    /** @type {ShotType} */
    shotType: '',
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
    exportedMillis: 0,
    exportedFileName: '',
    /** @type {ShotType} */
    exportedShotType: '',
  };
}

/**
 * @param {Partial<Store>} out
 * @param {Store} store
 */
export function cloneStore(out, store) {
  let outDocuments = out.documents || {};
  for (let document of Object.values(store.documents)) {
    let outDocument =
      outDocuments[document.documentId] || createDocument(document.documentId);
    let newDocument = cloneDocument(outDocument, document);
    outDocuments[newDocument.documentId] = newDocument;
  }
  out.documents = outDocuments;
  return /** @type {Store} */ (out);
}

/**
 * @param {Partial<Document>} out
 * @param {Document} document
 * @returns {Document}
 */
export function cloneDocument(out, document) {
  out.documentId = document.documentId;
  out.documentTitle = document.documentTitle;
  out.revisionNumber = document.revisionNumber;
  out.sceneOrder = document.sceneOrder.slice();

  let outScenes = out.scenes || {};
  for (let scene of Object.values(document.scenes)) {
    let sceneId = scene.sceneId;
    let outScene = outScenes[sceneId] || createScene(sceneId);
    let newScene = cloneScene(outScene, scene);
    outScenes[sceneId] = newScene;
  }
  out.scenes = outScenes;

  let outShots = out.shots || {};
  for (let shot of Object.values(document.shots)) {
    let shotId = shot.shotId;
    let outShot = outShots[shotId] || createShot(shotId);
    let newShot = cloneShot(outShot, shot);
    outShots[shotId] = newShot;
  }
  out.shots = outShots;

  let outTakes = out.takes || {};
  for (let take of Object.values(document.takes)) {
    let takeId = take.takeId;
    let outTake = outTakes[takeId] || createTake(takeId);
    let newTake = cloneTake(outTake, take);
    outTakes[takeId] = newTake;
  }
  out.takes = outTakes;

  return /** @type {Document} */ (out);
}

/**
 * @param {Partial<Scene>} out
 * @param {Scene} scene
 * @returns {Scene}
 */
export function cloneScene(out, scene) {
  out.sceneId = scene.sceneId;
  out.shotIds = scene.shotIds.slice();
  out.sceneName = scene.sceneName;
  return /** @type {Scene} */ (out);
}

/**
 * @param {Partial<Shot>} out
 * @param {Shot} shot
 * @returns {Shot}
 */
export function cloneShot(out, shot) {
  out.shotId = shot.shotId;
  out.shotType = shot.shotType;
  out.description = shot.description;
  out.takeIds = shot.takeIds.slice();
  return /** @type {Shot} */ (out);
}

/**
 * @param {Partial<Take>} out
 * @param {Take} take
 * @returns {Take}
 */
export function cloneTake(out, take) {
  out.takeId = take.takeId;
  out.notes = take.notes;
  out.exportedMillis = take.exportedMillis;
  out.exportedFileName = take.exportedFileName;
  out.exportedShotType = take.exportedShotType;
  return /** @type {Take} */ (out);
}

/**
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {number} takeNumber
 * @param {ShotType} [shotType]
 */
export function toScenShotTakeType(
  sceneNumber,
  shotNumber,
  takeNumber,
  shotType,
) {
  return [
    sceneNumber > 0 ? String(sceneNumber).padStart(2, '0') : '--',
    shotNumber > 0
      ? String.fromCharCode('A'.charCodeAt(0) + (shotNumber - 1))
      : '--',
    `${takeNumber > 0 ? String(takeNumber).padStart(2, '0') : '--'}`,
    typeof shotType !== 'undefined'
      ? ShotTypes.getParamsByType(shotType).abbr
      : ANY_SHOT.abbr,
  ];
}
