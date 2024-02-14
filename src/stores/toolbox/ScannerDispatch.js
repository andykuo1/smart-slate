import { zi, ziget } from '../ZustandImmerHelper';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchForScanner(set, get) {
  return {
    UNSAFE_getScannerStore: ziget(get, UNSAFE_getScannerStore),
    setScannerFileObject: zi(set, setScannerFileObject),
    setScannerFileAnalysis: zi(set, setScannerFileAnalysis),
    setScannerFileRenameValue: zi(set, setScannerFileRenameValue),
    clearScannerStore: zi(set, clearScannerStore),
    toggleScannerSettingsShowAnalysis: zi(
      set,
      toggleScannerSettingsShowAnalysis,
    ),
    toggleScannerSettingsCaptureSnapshot: zi(
      set,
      toggleScannerSettingsCaptureSnapshot,
    ),
    toggleScannerSettingsEnableTranscoder: zi(
      set,
      toggleScannerSettingsEnableTranscoder,
    ),
  };
}

/**
 * @param {import('./ToolboxStore').Store} store
 */
function UNSAFE_getScannerStore(store) {
  return store.scanner;
}

/**
 * @param {import('./ToolboxStore').Store} store
 */
function clearScannerStore(store) {
  let scanner = store.scanner;
  scanner.files = {};
  scanner.analysis = {};
  scanner.renames = {};
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {import('./ToolboxStore').FileKey} fileKey
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 */
function setScannerFileObject(store, fileKey, file) {
  store.scanner.files[fileKey] = file;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {import('./ToolboxStore').FileKey} fileKey
 * @param {import('./ToolboxStore').ScannerAnalysisInfo} analysis
 */
function setScannerFileAnalysis(store, fileKey, analysis) {
  store.scanner.analysis[fileKey] = analysis;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {import('./ToolboxStore').FileKey} fileKey
 * @param {string} value
 */
function setScannerFileRenameValue(store, fileKey, value) {
  store.scanner.renames[fileKey] = value;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {boolean} [force]
 */
function toggleScannerSettingsShowAnalysis(store, force = undefined) {
  let settings = store.scanner.settings;
  settings.showAnalysis =
    typeof force !== 'undefined' ? force : !settings.showAnalysis;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {boolean} [force]
 */
function toggleScannerSettingsCaptureSnapshot(store, force = undefined) {
  let settings = store.scanner.settings;
  settings.captureSnapshot =
    typeof force !== 'undefined' ? force : !settings.captureSnapshot;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {boolean} [force]
 */
function toggleScannerSettingsEnableTranscoder(store, force = undefined) {
  let settings = store.scanner.settings;
  settings.enableTranscoder =
    typeof force !== 'undefined' ? force : !settings.enableTranscoder;
}
