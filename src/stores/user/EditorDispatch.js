import { zi, ziget } from '../ZustandImmerHelper';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchForEditor(set, get) {
  return {
    UNSAFE_getEditorStore: ziget(get, UNSAFE_getEditorStore),
    setShotEditorShotId: zi(set, setShotEditorShotId),
    toggleDocumentEditorCursorType: zi(set, toggleDocumentEditorCursorType),
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

/**
 * @param {import('./UserStore').Store} store
 * @param {import('./EditorStore').DocumentEditorCursorType} cursorType
 */
function toggleDocumentEditorCursorType(store, cursorType) {
  let prev = store.editor.documentEditor ?? {};
  if (prev.cursorType === cursorType) {
    cursorType = '';
  }
  store.editor.documentEditor = {
    ...prev,
    cursorType: cursorType,
  };
}
