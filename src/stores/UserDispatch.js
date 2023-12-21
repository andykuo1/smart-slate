import { zi } from './ZustandImmerHelper';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 */
export function createDispatch(set) {
  return {
    setUserCursor: zi(set, setUserCursor),
    setRecorderActive: zi(set, setRecorderActive),
    setRecorderStatus: zi(set, setRecorderStatus),

    setPreferNativeRecorder: zi(set, setPreferNativeRecorder),
    setPreferMutedWhileRecording: zi(set, setPreferMutedWhileRecording),
  };
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {import('./DocumentStore').TakeId} [takeId]
 */
function setUserCursor(store, documentId, sceneId, shotId, takeId = undefined) {
  let cursor = store.cursor;
  cursor.documentId = documentId;
  cursor.sceneId = sceneId;
  cursor.shotId = shotId;
  if (typeof takeId !== 'undefined') {
    cursor.takeId = takeId;
  }
}

/**
 * @param {import('./UserStore').Store} store
 * @param {boolean} active
 * @param {boolean} forceStart
 */
function setRecorderActive(store, active, forceStart) {
  let recorder = store.recorder;
  recorder.active = active;
  recorder.forceStart = forceStart;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {string|Error} status
 */
function setRecorderStatus(store, status) {
  let recorder = store.recorder;
  recorder.status = status;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {boolean} enabled
 */
function setPreferNativeRecorder(store, enabled) {
  let settings = store.settings;
  settings.preferNativeRecorder = enabled;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {boolean} enabled
 */
function setPreferMutedWhileRecording(store, enabled) {
  let settings = store.settings;
  settings.preferMutedWhileRecording = enabled;
}
