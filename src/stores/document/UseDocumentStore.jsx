import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createDispatch } from './DocumentDispatch';
import { createStore } from './DocumentStore';

export const LOCAL_STORAGE_KEY = 'documentStore';

/** @typedef {import('./DocumentStore').Store & import('./DocumentDispatch').Dispatch} StoreAndDispatch */

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
    },
  ),
);
