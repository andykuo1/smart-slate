/** @typedef {'move'|''} DocumentEditorCursorType */
/** @typedef {'moodboard'|'shots'|''} DocumentEditorSplitView */

export function createEditorStore() {
  return {
    documentEditor: {
      /** @type {DocumentEditorCursorType} */
      cursorType: '',
      splitView: '',
    },
    shotEditor: {
      /** @type {import('@/stores/document/DocumentStore').ShotId} */
      shotId: '',
    },
  };
}
