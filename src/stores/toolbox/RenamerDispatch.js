import { zi, ziget } from '../ZustandImmerHelper';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchForRenamer(set, get) {
  return {
    UNSAFE_getRenamerStore: ziget(get, UNSAFE_getRenamerStore),
    setRenamerFileObject: zi(set, setRenamerFileObject),
    setRenamerFileRenameValue: zi(set, setRenamnerFileRenameValue),
    clearRenamerStore: zi(set, clearRenamerStore),
  };
}

/**
 * @param {import('./ToolboxStore').Store} store
 */
function UNSAFE_getRenamerStore(store) {
  return store.renamer;
}

/**
 * @param {import('./ToolboxStore').Store} store
 */
function clearRenamerStore(store) {
  let renamer = store.renamer;
  renamer.files = {};
  renamer.renames = {};
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {import('./ToolboxStore').FileKey} fileKey
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 */
function setRenamerFileObject(store, fileKey, file) {
  store.renamer.files[fileKey] = file;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {import('./ToolboxStore').FileKey} fileKey
 * @param {string} value
 */
function setRenamnerFileRenameValue(store, fileKey, value) {
  store.renamer.renames[fileKey] = value;
}
