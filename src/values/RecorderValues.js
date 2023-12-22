import { getMediaRecorderSupportedMimeType } from '@/recorder/MediaRecorderSupport';

const MEDIA_RECORDER_POSSIBLE_MIME_TYPES = [
  'video/mp4',
  'video/ogg',
  'video/webm',
  'video/quicktime',
];
const MEDIA_RECORDER_SUPPORTED_MIME_TYPE =
  getMediaRecorderSupportedMimeType(MEDIA_RECORDER_POSSIBLE_MIME_TYPES) ||
  MEDIA_RECORDER_POSSIBLE_MIME_TYPES[0];

/** @type {MediaRecorderOptions} */
export const MEDIA_RECORDER_OPTIONS = {
  mimeType: MEDIA_RECORDER_SUPPORTED_MIME_TYPE,
};

/** @type {MediaStreamConstraints} */
export const MEDIA_STREAM_CONSTRAINTS = {
  video: {
    facingMode: 'environment',
    width: { ideal: 7680 },
    height: { ideal: 4320 },
    aspectRatio: { ideal: 16 / 9 },
  },
  audio: true,
};

/** @type {BlobPropertyBag} */
export const MEDIA_BLOB_OPTIONS = {
  type: MEDIA_RECORDER_SUPPORTED_MIME_TYPE,
};
