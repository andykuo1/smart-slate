import { zi } from '../../ZustandImmerHelper';
import { incrementDocumentRevisionNumber } from './DispatchDocuments';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchTakes(set, get) {
  return {
    setTakeExportedGoogleDriveFileId: zi(set, setTakeExportedGoogleDriveFileId),
    setTakeExportedIDBKey: zi(set, setTakeExportedIDBKey),
    setTakePreviewImage: zi(set, setTakePreviewImage),
    setTakeRating: zi(set, setTakeRating),
  };
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').TakeId} takeId
 * @param {string} fileId
 */
export function setTakeExportedGoogleDriveFileId(
  store,
  documentId,
  takeId,
  fileId,
) {
  let document = store.documents[documentId];
  let take = document.takes[takeId];
  take.exportedGDriveFileId = fileId;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').TakeId} takeId
 * @param {string} previewImage
 */
export function setTakePreviewImage(store, documentId, takeId, previewImage) {
  let document = store.documents[documentId];
  let take = document.takes[takeId];
  take.previewImage = previewImage;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').TakeId} takeId
 * @param {number} rating
 */
export function setTakeRating(store, documentId, takeId, rating) {
  let document = store.documents[documentId];
  let take = document.takes[takeId];
  take.rating = rating;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').TakeId} takeId
 * @param {string} idbKey
 */
export function setTakeExportedIDBKey(store, documentId, takeId, idbKey) {
  let document = store.documents[documentId];
  let take = document.takes[takeId];
  take.exportedIDBKey = idbKey;
  incrementDocumentRevisionNumber(document);
}
