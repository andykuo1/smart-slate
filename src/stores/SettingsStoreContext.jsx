import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createDispatch } from './SettingsDispatch';
import { createStore } from './SettingsStore';

export const LOCAL_STORAGE_KEY = 'settingsStore';

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

export function useSetPreferNativeRecorder() {
  return useSettingsStore((ctx) => ctx.setPreferNativeRecorder);
}

export function usePreferNativeRecorder() {
  return useSettingsStore((ctx) => ctx.user.preferNativeRecorder);
}

export function useSetPreferMutedWhileRecording() {
  return useSettingsStore((ctx) => ctx.setPreferMutedWhileRecording);
}

export function usePreferMutedWhileRecording() {
  return useSettingsStore((ctx) => ctx.user.preferMutedWhileRecording);
}

export function useEnableDriveSync() {
  return useSettingsStore((ctx) => ctx.user.enableDriveSync);
}

export function useSetEnableDriveSync() {
  return useSettingsStore((ctx) => ctx.setEnableDriveSync);
}
