import { zi } from './ZustandImmerHelper';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StateCreator<?>} set
 */
export function createDispatch(set) {
  return {
    setUserCursor: zi(set, setUserCursor),
  };
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {import('./DocumentStore').TakeId} [takeId]
 */
export function setUserCursor(
  store,
  documentId,
  sceneId,
  shotId,
  takeId = undefined,
) {
  let cursor = store.cursor;
  cursor.documentId = documentId;
  cursor.sceneId = sceneId;
  cursor.shotId = shotId;
  if (typeof takeId !== 'undefined') {
    cursor.takeId = takeId;
  }
}
