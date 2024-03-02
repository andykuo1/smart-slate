/** @typedef {ReturnType<createStore>} Store */

export const CURRENT_CLAPPER_SETTINGS_VERSION = 1;

export function createStore() {
  return {
    settingsVersion: CURRENT_CLAPPER_SETTINGS_VERSION,
    blackboard: false,
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
