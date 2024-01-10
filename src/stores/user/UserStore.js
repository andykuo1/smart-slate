/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createCursor>} Cursor
 * @typedef {ReturnType<createRecorder>} Recorder
 */

export function createStore() {
  return {
    cursor: createCursor(),
    recorder: createRecorder(),
    /** @type {'shotlist'|'story'} */
    editMode: 'story',
  };
}

export function createCursor() {
  return {
    /** @type {import('@/stores/document/DocumentStore').DocumentId} */
    documentId: '',
    /** @type {import('@/stores/document/DocumentStore').SceneId} */
    sceneId: '',
    /** @type {import('@/stores/document/DocumentStore').ShotId} */
    shotId: '',
    /** @type {import('@/stores/document/DocumentStore').TakeId} */
    takeId: '',
    /** @type {import('@/stores/document/DocumentStore').BlockId} */
    blockId: '',
  };
}

export function createRecorder() {
  return {
    active: false,
    forceStart: false,
  };
}
