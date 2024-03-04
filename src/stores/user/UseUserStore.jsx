import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createDispatch } from './UserDispatch';
import { createStore } from './UserStore';

/** @typedef {import('./UserStore').Store & import('./UserDispatch').Dispatch} StoreAndDispatch */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
export const useUserStore = create(
  persist(
    (set, get) => ({
      ...createStore(),
      ...createDispatch(set, get),
    }),
    {
      name: 'userStore',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
