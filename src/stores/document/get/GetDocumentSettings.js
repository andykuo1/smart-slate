/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function getDocumentSettingsById(store, documentId) {
  return store?.documents?.[documentId]?.settings;
}
