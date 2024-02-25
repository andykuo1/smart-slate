/** @typedef {'move'|''} DocumentEditorCursorType */

export function createEditorStore() {
  return {
    documentEditor: {
      /** @type {DocumentEditorCursorType} */
      cursorType: '',
    },
    shotEditor: {
      /** @type {import('@/stores/document/DocumentStore').ShotId} */
      shotId: '',
    },
  };
}
