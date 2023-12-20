import { zi } from './ZustandImmerHelper';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatch(set, get) {
  return {
    addDocument: zi(set, addDocument),
    addScene: zi(set, addScene),
    addShot: zi(set, addShot),
    addTake: zi(set, addTake),

    deleteDocument: zi(set, deleteDocument),
    deleteScene: zi(set, deleteScene),
    deleteShot: zi(set, deleteShot),
    deleteTake: zi(set, deleteTake),

    setDocumentTitle: zi(set, setDocumentTitle),
    updateDocument: zi(set, updateDocument),

    setSceneHeading: zi(set, setSceneHeading),

    setShotType: zi(set, setShotType),
    setShotDescription: zi(set, setShotDescription),
    setShotThumbnail: zi(set, setShotThumbnail),
    updateShot: zi(set, updateShot),

    setTakeExportedGoogleDriveFileId: zi(set, setTakeExportedGoogleDriveFileId),
    setTakePreviewImage: zi(set, setTakePreviewImage),

    incrementDocumentRevisionNumber: zi(set, incrementDocumentRevisionNumber),

    /** @type {() => import('./DocumentStore').Store} */
    UNSAFE_getStore: get,
  };
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
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function getShotIndex(store, documentId, sceneId, shotId) {
  return getSceneById(store, documentId, sceneId)?.shotIds.indexOf(shotId) + 1;
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function getTakeIndex(store, documentId, shotId, takeId) {
  return getShotById(store, documentId, shotId)?.takeIds.indexOf(takeId) + 1;
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
export function getShotIdsInOrder(store, documentId, sceneId) {
  return getSceneById(store, documentId, sceneId)?.shotIds || [];
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
 * @param {import('./DocumentStore').Document} document
 */
function incrementDocumentRevisionNumber(document) {
  document.revisionNumber += 1;
  document.lastUpdatedMillis = Date.now();
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').Document} document
 */
function addDocument(store, document) {
  store.documents[document.documentId] = document;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').Scene} scene
 */
function addScene(store, documentId, scene) {
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
function addShot(store, documentId, sceneId, shot) {
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
function addTake(store, documentId, shotId, take) {
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
function deleteDocument(store, documentId) {
  let document = store.documents[documentId];
  delete store.documents[documentId];
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 */
function deleteScene(store, documentId, sceneId) {
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
function deleteShot(store, documentId, shotId) {
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
function deleteTake(store, documentId, takeId) {
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

/**
 * @callback UpdateDocumentHandler
 * @param {import('./DocumentStore').Document} document
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').Store} store
 */

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {UpdateDocumentHandler} handler
 */
function updateDocument(store, documentId, handler) {
  let document = store.documents[documentId];
  handler(document, documentId, store);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {string} title
 */
function setDocumentTitle(store, documentId, title) {
  let document = store.documents[documentId];
  document.documentTitle = title;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 * @param {string} heading
 */
function setSceneHeading(store, documentId, sceneId, heading) {
  let document = store.documents[documentId];
  let scene = document.scenes[sceneId];
  scene.sceneHeading = heading;
  incrementDocumentRevisionNumber(document);
}

/**
 * @callback UpdateShotHandler
 * @param {import('./DocumentStore').Shot} shot
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').Store} store
 */

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {UpdateShotHandler} handler
 */
function updateShot(store, documentId, shotId, handler) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  handler(shot, shotId, documentId, store);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {import('./DocumentStore').ShotType} shotType
 */
function setShotType(store, documentId, shotId, shotType) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.shotType = shotType;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {string} description
 */
function setShotDescription(store, documentId, shotId, description) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.description = description;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {string} thumbnailUrl
 */
function setShotThumbnail(store, documentId, shotId, thumbnailUrl) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.thumbnail = thumbnailUrl;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').TakeId} takeId
 * @param {string} fileId
 */
function setTakeExportedGoogleDriveFileId(store, documentId, takeId, fileId) {
  let document = store.documents[documentId];
  let take = document.takes[takeId];
  take.exportedGoogleDriveFileId = fileId;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('./DocumentStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').TakeId} takeId
 * @param {string} previewImage
 */
function setTakePreviewImage(store, documentId, takeId, previewImage) {
  let document = store.documents[documentId];
  let take = document.takes[takeId];
  take.previewImage = previewImage;
  incrementDocumentRevisionNumber(document);
}
