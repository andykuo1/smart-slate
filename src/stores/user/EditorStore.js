/** @typedef {ReturnType<createBlockViewOptions>} BlockViewOptions */
/** @typedef {'grid'|'list'|'group'|''} BlockViewShotListType */
/** @typedef {'faded'|'cutoff'|''} BlockViewShotBorderType */

/** @typedef {ReturnType<createSceneViewOptions>} SceneViewOptions */

/** @typedef {ReturnType<createDocumentEditorOptions>} DocumentEditorOptions */
/** @typedef {'edit'|''} DocumentEditorCursorType */
/** @typedef {'moodboard'|'shots'|''} DocumentEditorSplitView */

/** @typedef {ReturnType<createShotEditorOptions>} ShotEditorOptions */

export function createEditorStore() {
  return {
    documentEditor: createDocumentEditorOptions(),
    shotEditor: createShotEditorOptions(),
  };
}

export function createDocumentEditorOptions() {
  return {
    /** @type {DocumentEditorCursorType} */
    cursorType: '',
    /** @type {DocumentEditorSplitView} */
    splitView: '',
    /** @type {Record<import('@/stores/document/DocumentStore').BlockId, BlockViewOptions>} */
    blockViews: {},
    /** @type {Record<import('@/stores/document/DocumentStore').SceneId, SceneViewOptions>} */
    sceneViews: {},
  };
}

export function createBlockViewOptions() {
  return {
    /** @type {BlockViewShotListType} */
    shotListType: '',
  };
}

export function createShotEditorOptions() {
  return {
    /** @type {import('@/stores/document/DocumentStore').ShotId} */
    shotId: '',
  };
}

export function createSceneViewOptions() {
  return {
    /** @type {BlockViewShotListType} */
    shotListType: '',
  };
}
