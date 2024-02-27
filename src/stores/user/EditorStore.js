/** @typedef {'edit'|''} DocumentEditorCursorType */
/** @typedef {'moodboard'|'shots'|''} DocumentEditorSplitView */

export function createEditorStore() {
  return {
    documentEditor: {
      /** @type {DocumentEditorCursorType} */
      cursorType: '',
      /** @type {DocumentEditorSplitView} */
      splitView: '',
    },
    shotEditor: {
      /** @type {import('@/stores/document/DocumentStore').ShotId} */
      shotId: '',
    },
  };
}
