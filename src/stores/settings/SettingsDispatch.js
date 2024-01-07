import { zi } from '@/stores/ZustandImmerHelper';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 */
export function createDispatch(set) {
  return {
    setPreferNativeRecorder: zi(set, setPreferNativeRecorder),
    setPreferMutedWhileRecording: zi(set, setPreferMutedWhileRecording),
    setEnableThumbnailWhileRecording: zi(set, setEnableThumbnailWhileRecording),
    setEnableDriveSync: zi(set, setEnableDriveSync),
    setPreferPersistedMediaStream: zi(set, setPreferPersistedMediaStream),
    setShow4x3Box: zi(set, setShow4x3Box),
  };
}

/**
 * @param {import('./SettingsStore').Store} store
 * @param {boolean} enabled
 */
export function setPreferNativeRecorder(store, enabled) {
  let settings = store.user;
  settings.preferNativeRecorder = enabled;
}

/**
 * @param {import('./SettingsStore').Store} store
 * @param {boolean} enabled
 */
export function setPreferMutedWhileRecording(store, enabled) {
  let settings = store.user;
  settings.preferMutedWhileRecording = enabled;
}

/**
 * @param {import('./SettingsStore').Store} store
 * @param {boolean} enabled
 */
export function setEnableThumbnailWhileRecording(store, enabled) {
  let settings = store.user;
  settings.enableThumbnailWhileRecording = enabled;
}

/**
 * @param {import('./SettingsStore').Store} store
 * @param {boolean} enabled
 */
export function setEnableDriveSync(store, enabled) {
  let settings = store.user;
  settings.enableDriveSync = enabled;
}

/**
 * @param {import('./SettingsStore').Store} store
 * @param {boolean} enabled
 */
export function setPreferPersistedMediaStream(store, enabled) {
  let settings = store.user;
  settings.preferPersistedMediaStream = enabled;
}

/**
 * @param {import('./SettingsStore').Store} store
 * @param {boolean} enabled
 */
export function setShow4x3Box(store, enabled) {
  let settings = store.user;
  settings.show4x3Box = enabled;
}
