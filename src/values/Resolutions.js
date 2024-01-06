export const MAX_THUMBNAIL_WIDTH = 256;
export const MAX_THUMBNAIL_HEIGHT = 144;

export const RATIO_16_BY_9 = 16 / 9;
export const RATIO_4_BY_3 = 4 / 3;

export const STANDARD_VIDEO_RESOLUTIONS = {
  '8K': createVideoResolution('8K', 7680, 4320, RATIO_16_BY_9),
  '4K': createVideoResolution('4K', 3840, 2160, RATIO_16_BY_9),
  '1080p': createVideoResolution('1080p', 1920, 1080, RATIO_16_BY_9),
  '720p': createVideoResolution('720p', 1280, 720, RATIO_16_BY_9),
  VGA: createVideoResolution('VGA', 640, 480, RATIO_16_BY_9),
  '360p': createVideoResolution('VGA', 640, 360, RATIO_16_BY_9),
  CIF: createVideoResolution('VGA', 352, 288, RATIO_4_BY_3),
};

/** @typedef {ReturnType<createVideoResolution>} VideoResolution */

/**
 * @param {string} name
 * @param {number} width
 * @param {number} height
 * @param {number} ratio
 */
export function createVideoResolution(name, width, height, ratio) {
  return {
    name,
    width,
    height,
    ratio,
  };
}
