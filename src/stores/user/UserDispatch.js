import { zi } from '../ZustandImmerHelper';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 */
export function createDispatch(set) {
  return {
    setUserCursor: zi(set, setUserCursor),
    setRecorderActive: zi(set, setRecorderActive),
    setEditMode: zi(set, setEditMode),
    setRecordMode: zi(set, setRecordMode),
  };
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} [takeId]
 * @param {import('@/stores/document/DocumentStore').BlockId} [blockId]
 */
function setUserCursor(
  store,
  documentId,
  sceneId,
  shotId,
  takeId = undefined,
  blockId = undefined,
) {
  let cursor = store.cursor;
  cursor.documentId = documentId;
  cursor.sceneId = sceneId;
  cursor.shotId = shotId;
  if (typeof takeId !== 'undefined') {
    cursor.takeId = takeId;
  }
  if (typeof blockId !== 'undefined') {
    cursor.blockId = blockId;
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
 * @param {'story'|'shotlist'} editMode
 */
function setEditMode(store, editMode) {
  store.editMode = editMode;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {'recorder'|'clapper'} recordMode
 */
function setRecordMode(store, recordMode) {
  store.recordMode = recordMode;
}
