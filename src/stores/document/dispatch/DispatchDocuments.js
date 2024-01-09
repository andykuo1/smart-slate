import { getDocumentById, getShotById } from '..';
import { zi } from '../../ZustandImmerHelper';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchDocuments(set, get) {
  return {
    setDocumentTitle: zi(set, setDocumentTitle),
    updateDocument: zi(set, updateDocument),

    setSceneHeading: zi(set, setSceneHeading),

    setBlockContent: zi(set, setBlockContent),

    incrementDocumentRevisionNumber: zi(set, incrementDocumentRevisionNumber),
    assignAvailableShotHash: zi(set, assignAvailableShotHash),
  };
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
export function updateDocument(store, documentId, handler) {
  let document = store.documents[documentId];
  handler(document, documentId, store);
  incrementDocumentRevisionNumber(document);
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {string} title
 */
export function setDocumentTitle(store, documentId, title) {
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
export function setSceneHeading(store, documentId, sceneId, heading) {
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
export function setBlockContent(
  store,
  documentId,
  blockId,
  contentType,
  content,
) {
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

const MAX_SHOT_HASH_RANGE = 9999;

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 */
export function findNextAvailableShotHash(store, documentId) {
  let document = getDocumentById(store, documentId);
  if (document.shotHashes.length >= MAX_SHOT_HASH_RANGE) {
    throw new Error('Out of available shot hashes.');
  }
  let hash = Math.floor(Math.random() * MAX_SHOT_HASH_RANGE) + 1;
  let result = String(hash).padStart(4, '0');
  while (document.shotHashes.includes(result)) {
    hash = (hash + 1) % (MAX_SHOT_HASH_RANGE + 1);
    if (hash <= 0) {
      hash = 1;
    }
    result = String(hash).padStart(4, '0');
  }
  return result;
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {import('../DocumentStore').ShotHash} shotHash
 */
export function assignAvailableShotHash(store, documentId, shotId, shotHash) {
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
