import { FFmpeg } from '@ffmpeg/ffmpeg';

import { FFmpegLogging } from '@/scanner/FFmpegTranscoder';

/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createScannerStore>} ScannerStore
 * @typedef {ReturnType<createScannerAnalysisInfo>} ScannerAnalysisInfo
 * @typedef {ReturnType<createScannerSlateInfo>} ScannerSlateInfo
 * @typedef {ReturnType<createTranscoderStore>} TranscoderStore
 * @typedef {ReturnType<createRenamerStore>} RenamerStore
 *
 * @typedef {string} FileKey
 */

export function createStore() {
  return {
    scanner: createScannerStore(),
    transcoder: createTranscoderStore(),
    renamer: createRenamerStore(),
  };
}

export function createScannerStore() {
  return {
    /** @type {Record<FileKey, import('@/scanner/DirectoryPicker').FileWithHandles>} */
    files: {},
    /** @type {Record<FileKey, ScannerAnalysisInfo>} */
    analysis: {},
    /** @type {Record<FileKey, ScannerSlateInfo>} */
    slates: {},
    /** @type {Record<FileKey, string>} */
    renames: {},
    settings: createScannerSettings(),
  };
}

export function createTranscoderStore() {
  return {
    /** @type {'unloaded'|'loading'|'ready'|'error'} */
    status: 'unloaded',
    /** @type {FFmpeg|null} */
    ffmpeg: null,
    /** @type {Array<string>} */
    codecs: [],
    /** @type {FFmpegLogging|null} */
    logging: null,
  };
}

export function createRenamerStore() {
  return {
    /** @type {Record<FileKey, import('@/scanner/DirectoryPicker').FileWithHandles>} */
    files: {},
    /** @type {Record<FileKey, string>} */
    renames: {},
  };
}

export function createScannerAnalysisInfo() {
  return {
    progress: -1,
    qrCode: '',
    snapshot: '',
    /** @type {any} */
    decoded: {},
    takeId: '',
  };
}

export function createScannerSettings() {
  return {
    showAnalysis: false,
    captureSnapshot: true,
    enableTranscoder: true,
  };
}

export function createScannerSlateInfo() {
  return {
    rollName: '',
    printRating: 0,
    comments: '',
  };
}
