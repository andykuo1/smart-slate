/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createCursor>} Cursor
 */

export function createStore() {
  return {
    cursor: createCursor(),
  };
}

export function createCursor() {
  return {
    /** @type {import('./DocumentStore').DocumentId} */
    documentId: '',
    /** @type {import('./DocumentStore').SceneId} */
    sceneId: '',
    /** @type {import('./DocumentStore').ShotId} */
    shotId: '',
    /** @type {import('./DocumentStore').TakeId} */
    takeId: '',
  };
}
