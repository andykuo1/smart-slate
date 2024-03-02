import { createZIStoreInLocalStorage } from '../../ZustandImmerStoreHelper';
import { createDispatch } from './Dispatch';
import {
  CURRENT_CLAPPER_SETTINGS_VERSION,
  cloneStore,
  createStore,
} from './Store';

export const useClapperSettingsStore = createZIStoreInLocalStorage(
  'clapperSettingsStore',
  CURRENT_CLAPPER_SETTINGS_VERSION,
  {
    createStore,
    createDispatch,
    cloneStore,
    findVersion(store) {
      /** @type {Array<number>} */
      let result = [];
      if (typeof store.settingsVersion !== 'undefined') {
        result.push(store.settingsVersion);
      }
      if (result.length === 0) {
        return;
      }
      result.sort();
      return `[${result.map((item) => `v${item}`).join(',')}]`;
    },
  },
);

/**
 * @template T
 * @param {(dispatch: import('./Dispatch').Dispatch) => T} selector
 * @returns {T}
 */
export function useClapperSettingsDispatch(selector) {
  return useClapperSettingsStore((ctx) => selector(ctx.dispatch));
}

export function useUNSAFE_getClapperSettingsStore() {
  return useClapperSettingsStore((ctx) => ctx.dispatch.UNSAFE_getStore);
}
