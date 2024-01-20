import { zi } from '@/stores/ZustandImmerHelper';

import { cloneDocument } from '../DocumentStore';
import { getDocumentById, getShotById } from '../get';
import { addDocument } from './DispatchAddDelete';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchDocuments(set, get) {
  return {
    setDocumentTitle: zi(set, setDocumentTitle),
    updateDocument: zi(set, updateDocument),
    applyDocument: zi(set, applyDocument),

    setSceneHeading: zi(set, setSceneHeading),
    setBlockContent: zi(set, setBlockContent),

    incrementDocumentRevisionNumber: zi(set, incrementDocumentRevisionNumber),
    assignAvailableShotHash: zi(set, assignAvailableShotHash),
    trashDocument: zi(set, trashDocument),
    setDocumentLastExportedMillis: zi(set, setDocumentLastExportedMillis),
  };
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 */
function trashDocument(store, documentId) {
  const document = getDocumentById(store, documentId);
  if (!document) {
    return;
  }
  document.lastDeletedMillis = Date.now();
  // Remove all data.
  document.sceneOrder.length = 0;
  document.shotHashes.length = 0;
  document.scenes = {};
  document.blocks = {};
  document.shots = {};
  document.takes = {};
}

/**
 * @callback UpdateDocumentHandler
 * @param {import('../DocumentStore').Document} document
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').Store} store
 */

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {UpdateDocumentHandler} handler
 */
function updateDocument(store, documentId, handler) {
  let document = store.documents[documentId];
  handler(document, documentId, store);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {string} title
 */
function setDocumentTitle(store, documentId, title) {
  let document = store.documents[documentId];
  document.documentTitle = title;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').SceneId} sceneId
 * @param {string} heading
 */
function setSceneHeading(store, documentId, sceneId, heading) {
  let document = store.documents[documentId];
  let scene = document.scenes[sceneId];
  scene.sceneHeading = heading;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').BlockId} blockId
 * @param {import('../DocumentStore').BlockContentType} contentType
 * @param {string} content
 */
function setBlockContent(store, documentId, blockId, contentType, content) {
  let document = store.documents[documentId];
  let block = document.blocks[blockId];
  block.contentType = contentType;
  block.content = content;
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Document} document
 */
export function incrementDocumentRevisionNumber(document) {
  document.revisionNumber += 1;
  document.lastUpdatedMillis = Date.now();
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {import('../DocumentStore').ShotHash} shotHash
 */
function assignAvailableShotHash(store, documentId, shotId, shotHash) {
  let document = getDocumentById(store, documentId);
  let shot = getShotById(store, documentId, shotId);
  if (shot.shotHash) {
    throw new Error('Shot is already assigned another shot hash.');
  }
  if (document.shotHashes.includes(shotHash)) {
    throw new Error('The given shot hash is not available.');
  }
  shot.shotHash = shotHash;
  document.shotHashes.push(shotHash);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').Document} document
 * @param {boolean} [force]
 */
function applyDocument(store, documentId, document, force = false) {
  const existing = getDocumentById(store, documentId);
  if (!existing) {
    addDocument(store, document);
  } else {
    if (force || existing.lastUpdatedMillis < document.lastUpdatedMillis) {
      // Prefer most recent update
      cloneDocument(existing, document);
    } else {
      // Prefer existing document if no date available
    }
  }
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {number} millis
 */
function setDocumentLastExportedMillis(store, documentId, millis) {
  let document = getDocumentById(store, documentId);
  document.lastExportedMillis = millis;
}
