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

    incrementDocumentRevisionNumber: zi(set, incrementDocumentRevisionNumber),
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
 * @param {import('../DocumentStore').Document} document
 */
export function incrementDocumentRevisionNumber(document) {
  document.revisionNumber += 1;
  document.lastUpdatedMillis = Date.now();
}
