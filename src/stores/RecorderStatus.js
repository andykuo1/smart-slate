/** @type {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} */
export const IDLE = 'idle';
/** @type {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} */
export const PREPARING_STREAMS = 'preparing_streams';
/** @type {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} */
export const READY = 'ready';
/** @type {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} */
export const STARTING = 'starting';
/** @type {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} */
export const RECORDING = 'recording';
/** @type {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} */
export const STOPPING = 'stopping';
/** @type {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} */
export const STOPPED = 'stopped';

/** @type {Array<import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus>} */
const VALUES = [
  IDLE,
  PREPARING_STREAMS,
  READY,
  STARTING,
  RECORDING,
  STOPPING,
  STOPPED,
];

function values() {
  return VALUES;
}

/**
 * @param {string|Error} status
 */
function isPreparing(status) {
  return (
    typeof status === 'string' &&
    (status === 'preparing_streams' ||
      status === 'ready' ||
      status === 'starting')
  );
}

/**
 * @param {string|Error} status
 */
function isRecording(status) {
  return typeof status === 'string' && status === 'recording';
}

/**
 * @param {string|Error} status
 */
function isDone(status) {
  return (
    typeof status === 'string' &&
    (status === 'stopping' || status === 'stopped')
  );
}

const result = {
  values,
  isPreparing,
  isRecording,
  isDone,
};

export default result;
