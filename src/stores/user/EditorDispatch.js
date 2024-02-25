import { zi, ziget } from '../ZustandImmerHelper';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchForEditor(set, get) {
  return {
    UNSAFE_getEditorStore: ziget(get, UNSAFE_getEditorStore),
    setShotEditorShotId: zi(set, setShotEditorShotId),
  };
}

/**
 * @param {import('./UserStore').Store} store
 */
function UNSAFE_getEditorStore(store) {
  return store.editor;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
function setShotEditorShotId(store, shotId) {
  store.editor.shotEditor.shotId = shotId;
}
