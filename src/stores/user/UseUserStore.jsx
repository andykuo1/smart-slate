import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createDispatch } from './UserDispatch';
import { createStore } from './UserStore';

const SESSION_STORAGE_KEY = 'userStore';

/** @typedef {import('./UserStore').Store & import('./UserDispatch').Dispatch} StoreAndDispatch */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
export const useUserStore = create(
  persist(
    (set) => ({
      ...createStore(),
      ...createDispatch(set),
    }),
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
