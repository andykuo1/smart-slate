import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createDispatch } from '../DocumentDispatch';
import { cloneStore, createStore } from '../DocumentStore';

export const LOCAL_STORAGE_KEY = 'documentStore';

/** @typedef {import('../DocumentStore').Store & import('../DocumentDispatch').Dispatch} StoreAndDispatch */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
export const useDocumentStore = create(
  persist(
    (set, get) => ({
      ...createStore(),
      ...createDispatch(set, get),
    }),
    {
      name: LOCAL_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      /**
       * @param {unknown} persistedState
       * @param {unknown} version
       */
      async migrate(persistedState, version) {
        const initial = createStore();
        const result = cloneStore(
          initial,
          /** @type {import('@/stores/document/DocumentStore').Store} */ (
            persistedState
          ),
        );
        return /** @type {StoreAndDispatch} */ (result);
      },
    },
  ),
);
