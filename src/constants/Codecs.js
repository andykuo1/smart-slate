const CONTAINERS = [
  'webm',
  'ogg',
  'mp3',
  'mp4',
  'x-matroska',
  '3gpp',
  '3gpp2',
  '3gp2',
  'quicktime',
  'mpeg',
  'aac',
  'flac',
  'x-flac',
  'wave',
  'wav',
  'x-wav',
  'x-pn-wav',
  'not-supported',
];

const CODECS = [
  'vp9',
  'vp9.0',
  'vp8',
  'vp8.0',
  'avc1',
  'av1',
  'h265',
  'h.265',
  'h264',
  'h.264',
  'opus',
  'vorbis',
  'pcm',
  'aac',
  'mpeg',
  'mp4a',
  'rtx',
  'red',
  'ulpfec',
  'g722',
  'pcmu',
  'pcma',
  'cn',
  'telephone-event',
  'not-supported',
];

/**
 * @param {'video'|'audio'} media
 * @param {Array<string>} containers
 * @param {Array<string>} codecs
 */
function getSupportedMimeTypes(media, containers, codecs) {
  if (typeof window === 'undefined') {
    return [];
  }
  /** @type {Array<string>} */
  let result = [];
  containers.forEach((container) => {
    const mimeType = `${media}/${container}`;
    codecs.forEach((codec) =>
      [
        `${mimeType};codecs=${codec}`,
        `${mimeType};codecs=${codec.toUpperCase()}`,
      ].forEach((variation) => {
        if (MediaRecorder.isTypeSupported(variation)) {
          result.push(variation);
        }
      }),
    );
    if (MediaRecorder.isTypeSupported(mimeType)) {
      result.push(mimeType);
    }
  });
  return result;
}

const SUPPORTED_CODECS = [
  ...getSupportedMimeTypes('video', CONTAINERS, CODECS),
  ...getSupportedMimeTypes('audio', CONTAINERS, CODECS),
];

export default SUPPORTED_CODECS;
