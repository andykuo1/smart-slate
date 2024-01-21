/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function getDocumentById(store, documentId) {
  return store?.documents?.[documentId];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 */
export function getDocumentIds(store) {
  return Object.keys(store.documents) || [];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export function findDocumentWithTakeId(store, takeId) {
  if (!takeId) {
    return null;
  }
  for (let document of Object.values(store.documents)) {
    if (takeId in document.takes) {
      return document;
    }
  }
  return null;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {string} projectId
 */
export function findDocumentsWithProjectId(store, projectId) {
  let result = [];
  for (const documentId of getDocumentIds(store)) {
    const document = getDocumentById(store, documentId);
    if (document?.settings?.projectId === projectId) {
      result.push(document);
    }
  }
  return result;
}
