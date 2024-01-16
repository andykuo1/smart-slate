import { zi } from '@/stores/ZustandImmerHelper';

import { getDocumentById, getTakeById } from '../DocumentStoreHelper';
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
    setTakeExportedFileName: zi(set, setTakeExportedFileName),
    setTakeExportedQRCodeKey: zi(set, setTakeExportedQRCodeKey),
    toggleGoodTake: zi(set, toggleGoodTake),
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
 * @param {IDBValidKey} idbKey
 */
export function setTakeExportedIDBKey(store, documentId, takeId, idbKey) {
  let document = store.documents[documentId];
  let take = document.takes[takeId];
  take.exportedIDBKey = idbKey;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').TakeId} takeId
 * @param {string} fileNameWithExt
 */
export function setTakeExportedFileName(
  store,
  documentId,
  takeId,
  fileNameWithExt,
) {
  let document = store.documents[documentId];
  let take = document.takes[takeId];
  take.exportedFileName = fileNameWithExt;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').TakeId} takeId
 * @param {string} qrCodeKey
 */
export function setTakeExportedQRCodeKey(store, documentId, takeId, qrCodeKey) {
  let document = getDocumentById(store, documentId);
  let take = getTakeById(store, documentId, takeId);
  take.exportedQRCodeKey = qrCodeKey;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').TakeId} takeId
 */
export function toggleGoodTake(store, documentId, takeId) {
  let document = store.documents[documentId];
  let take = document.takes[takeId];
  if (take.rating <= 0) {
    take.rating = 1;
  } else {
    take.rating = 0;
  }
  incrementDocumentRevisionNumber(document);
}
