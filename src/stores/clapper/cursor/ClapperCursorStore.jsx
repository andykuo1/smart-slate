import { createZIStoreInLocalStorage } from '../../ZustandImmerStoreHelper';
import { createDispatch } from './Dispatch';
import {
  CURRENT_CLAPPER_CURSOR_VERSION,
  cloneStore,
  createStore,
} from './Store';

export const useClapperCursorStore = createZIStoreInLocalStorage(
  'clapperCursorStore',
  CURRENT_CLAPPER_CURSOR_VERSION,
  {
    createStore,
    createDispatch,
    cloneStore,
    findVersion(store) {
      /** @type {Array<number>} */
      let result = [];
      if (typeof store.cursorVersion !== 'undefined') {
        result.push(store.cursorVersion);
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
export function useClapperCursorDispatch(selector) {
  return useClapperCursorStore((ctx) => selector(ctx.dispatch));
}

export function useUNSAFE_getClapperCursorStore() {
  return useClapperCursorStore((ctx) => ctx.dispatch.UNSAFE_getStore);
}
