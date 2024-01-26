import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createDispatch } from '../DocumentDispatch';
import {
  CURRENT_DOCUMENT_VERSION,
  cloneStore,
  createStore,
} from '../DocumentStore';

export const LOCAL_STORAGE_KEY = 'documentStore';

/** @typedef {import('@/stores/document/DocumentStore').Store & import('../DocumentDispatch').Dispatch} StoreAndDispatch */

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
      /**
       * @param {unknown} persistedState
       * @param {StoreAndDispatch} currentState
       */
      merge(persistedState, currentState) {
        const { documents, ...currentDispatch } = currentState;
        const currentStore = { documents };

        /** @type {Array<number>} */
        let persistedVersions = [];
        for (let document of Object.values(
          /** @type {any} */ (persistedState)?.documents,
        )) {
          let version = document.documentVersion ?? 0;
          if (!persistedVersions.includes(version)) {
            persistedVersions.push(version);
          }
        }

        console.log(
          `[DocumentStore] Merging persisted stores [${persistedVersions
            .map((item) => 'v' + item)
            .join(', ')}] => [v${CURRENT_DOCUMENT_VERSION}].`,
        );

        let newStore = cloneStore({}, currentStore);
        cloneStore(
          newStore,
          /** @type {import('@/stores/document/DocumentStore').Store} */ (
            persistedState
          ),
        );
        return { ...newStore, ...currentDispatch };
      },
    },
  ),
);
