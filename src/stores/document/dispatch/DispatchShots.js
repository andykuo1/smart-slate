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
    setShotReferenceImage: zi(set, setShotReferenceImage),
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
function updateShot(store, documentId, shotId, handler) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  handler(shot, shotId, documentId, store);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {string} shotType
 */
function setShotType(store, documentId, shotId, shotType) {
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
function setShotDescription(store, documentId, shotId, description) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.description = description;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {string} referenceImageUrl
 */
function setShotReferenceImage(store, documentId, shotId, referenceImageUrl) {
  let document = store.documents[documentId];
  let shot = document.shots[shotId];
  shot.referenceImage = referenceImageUrl;
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
function moveShot(
  store,
  documentId,
  blockId,
  shotId,
  targetId,
  before = false,
) {
  const document = store.documents[documentId];
  const block = document.blocks[blockId];
  const shotIds = block.shotIds;
  const shotIndex = shotIds.indexOf(shotId);
  if (shotIndex < 0) {
    return;
  }
  if (shotIds.length <= 0) {
    return;
  }
  shotIds.splice(shotIndex, 1);
  const targetIndex = shotIds.indexOf(targetId);
  if (before) {
    shotIds.splice(targetIndex, 0, shotId);
  } else if (targetIndex + 1 < block.shotIds.length) {
    shotIds.splice(targetIndex + 1, 0, shotId);
  } else {
    shotIds.push(shotId);
  }
}
