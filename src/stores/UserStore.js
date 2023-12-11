/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createCursor>} Cursor
 * @typedef {ReturnType<createRecorder>} Recorder
 */
import { IDLE } from './RecorderStatus';

export function createStore() {
  return {
    cursor: createCursor(),
    recorder: createRecorder(),
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
    /** @type {string|Error} */
    status: IDLE,
    active: false,
    forceStart: false,
  };
}
