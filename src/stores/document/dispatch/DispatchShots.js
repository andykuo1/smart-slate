import { zi } from '../../ZustandImmerHelper';
import { incrementDocumentRevisionNumber } from './DispatchDocuments';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchShots(set, get) {
  return {
    setShotType: zi(set, setShotType),
    setShotDescription: zi(set, setShotDescription),
    setShotThumbnail: zi(set, setShotThumbnail),
    moveShot: zi(set, moveShot),
    updateShot: zi(set, updateShot),
  };
}

/**
 * @callback UpdateShotHandler
 * @param {import('../DocumentStore').Shot} shot
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').Store} store
 */

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {UpdateShotHandler} handler
 */
export function updateShot(store, documentId, shotId, handler) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  handler(shot, shotId, documentId, store);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {import('../DocumentStore').ShotType} shotType
 */
export function setShotType(store, documentId, shotId, shotType) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.shotType = shotType;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {string} description
 */
export function setShotDescription(store, documentId, shotId, description) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.description = description;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {string} thumbnailUrl
 */
export function setShotThumbnail(store, documentId, shotId, thumbnailUrl) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.thumbnail = thumbnailUrl;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').BlockId} blockId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {import('../DocumentStore').ShotId} targetId
 * @param {boolean} [before]
 */
export function moveShot(
  store,
  documentId,
  blockId,
  shotId,
  targetId,
  before = false,
) {
  const document = store.documents[documentId];
  const block = document.blocks[blockId];
  const shotIndex = block.shotIds.indexOf(shotId);
  const targetIndex = block.shotIds.indexOf(targetId);
  block.shotIds.splice(shotIndex, 1);
  if (before) {
    block.shotIds.splice(targetIndex, 0, shotId);
  } else if (targetIndex + 1 < block.shotIds.length) {
    block.shotIds.splice(targetIndex + 1, 0, shotId);
  } else {
    block.shotIds.push(shotId);
  }
}