import { zi, ziget } from '../ZustandImmerHelper';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchForViewer(set, get) {
  return {
    UNSAFE_getViewerStore: ziget(get, UNSAFE_getViewerStore),
    setViewerMode: zi(set, setViewerMode),
  };
}

/**
 * @param {import('./UserStore').Store} store
 */
function UNSAFE_getViewerStore(store) {
  return store.viewer;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('./UserStore').ViewerMode} mode
 */
function setViewerMode(store, mode) {
  store.viewer.mode = mode;
}
