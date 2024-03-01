/** @typedef {ReturnType<createStore>} Store */

export const CURRENT_CLAPPER_CURSOR_VERSION = 1;

export function createStore() {
  return {
    cursorVersion: CURRENT_CLAPPER_CURSOR_VERSION,
    clapperId: '',
    clapId: '',
    sceneNumber: 1,
    shotNumber: 1,
    rollName: '',
  };
}

/**
 * @param {Partial<Store>} out
 * @param {Partial<Store>} store
 */
export function cloneStore(out, store) {
  let result = {
    ...out,
    ...store,
  };
  return /** @type {Store} */ (result);
}
