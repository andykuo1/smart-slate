/**
 * @param {import('./UserStore').Store} store
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function getDocumentEditorBlockViewOptions(store, blockId) {
  return store?.editor?.documentEditor?.blockViews?.[blockId];
}
