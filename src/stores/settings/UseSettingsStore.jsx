import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createDispatch } from './SettingsDispatch';
import { createStore } from './SettingsStore';

const LOCAL_STORAGE_KEY = 'settingsStore';

/** @typedef {import('./SettingsStore').Store & import('./SettingsDispatch').Dispatch} StoreAndDispatch */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
export const useSettingsStore = create(
  persist(
    (set) => ({
      ...createStore(),
      ...createDispatch(set),
    }),
    {
      name: LOCAL_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
