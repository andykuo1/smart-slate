import { createZIStoreInLocalStorage } from '../ZustandImmerStoreHelper';
import { createDispatch } from './Dispatch';
import { CURRENT_CLAPPER_VERSION, cloneStore, createStore } from './Store';

export const useClapperStore = createZIStoreInLocalStorage(
  'clapperStore',
  CURRENT_CLAPPER_VERSION,
  {
    createStore,
    createDispatch,
    cloneStore,
    findVersion(store) {
      /** @type {Array<number>} */
      let result = [];
      for (let clapper of Object.values(store.clappers)) {
        if (!result.includes(clapper.clapperVersion)) {
          result.push(clapper.clapperVersion);
        }
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
export function useClapperDispatch(selector) {
  return useClapperStore((ctx) => selector(ctx.dispatch));
}

export function useUNSAFE_getClapperStore() {
  return useClapperStore((ctx) => ctx.dispatch.UNSAFE_getStore);
}
