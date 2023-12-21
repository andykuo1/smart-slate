/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createCursor>} Cursor
 * @typedef {ReturnType<createRecorder>} Recorder
 * @typedef {ReturnType<createSettings>} Settings
 */

export function createStore() {
  return {
    cursor: createCursor(),
    recorder: createRecorder(),
    settings: createSettings(),
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

export function createRecorder() {
  return {
    active: false,
    forceStart: false,
  };
}

export function createSettings() {
  return {
    preferNativeRecorder: false,
    preferMutedWhileRecording: true,
    enableThumbnailWhileRecording: true,
  };
}
