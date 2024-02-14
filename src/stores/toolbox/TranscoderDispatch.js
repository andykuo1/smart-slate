import { FFmpeg } from '@ffmpeg/ffmpeg';

import { FFmpegLogging } from '@/scanner/FFmpegTranscoder';

import { zi, ziget } from '../ZustandImmerHelper';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchForTranscoder(set, get) {
  return {
    UNSAFE_getTranscoderStore: ziget(get, UNSAFE_getTranscoderStore),
    setTranscoderFFmpeg: zi(set, setTranscoderFFmpeg),
    setTranscoderStatus: zi(set, setTranscoderStatus),
    setTranscoderLogger: zi(set, setTranscoderLogger),
    setTranscoderCodecs: zi(set, setTranscoderCodecs),
  };
}

/**
 * @param {import('./ToolboxStore').Store} store
 */
function UNSAFE_getTranscoderStore(store) {
  return store.transcoder;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {FFmpeg} ffmpeg
 */
function setTranscoderFFmpeg(store, ffmpeg) {
  store.transcoder.ffmpeg = ffmpeg;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {'loading'|'ready'|'error'} status
 */
function setTranscoderStatus(store, status) {
  store.transcoder.status = status;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {FFmpegLogging} logger
 */
function setTranscoderLogger(store, logger) {
  store.transcoder.logging = logger;
}

/**
 * @param {import('./ToolboxStore').Store} store
 * @param {Array<string>} codecs
 */
function setTranscoderCodecs(store, codecs) {
  store.transcoder.codecs = codecs;
}
