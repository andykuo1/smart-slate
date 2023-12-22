/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createSettings>} Settings
 */

export function createStore() {
  return {
    user: createSettings(),
  };
}

export function createSettings() {
  return {
    preferNativeRecorder: false,
    preferMutedWhileRecording: true,
    enableThumbnailWhileRecording: true,
    enableDriveSync: false,
  };
}
