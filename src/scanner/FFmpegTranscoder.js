import { FFmpeg } from '@ffmpeg/ffmpeg';

/**
 * @param {FFmpeg} ffmpeg
 * @param {string} fsFileName
 */
export async function getFFmpegVideoMetadata(ffmpeg, fsFileName) {
  let logging = new FFmpegLogging(ffmpeg);
  logging.startCapturing();
  await ffmpeg.exec(['-i', fsFileName]);
  let lines = logging.stopCapturing();

  let result = {
    duration: -1,
  };
  const DURATION_DELIMITER = 'Duration:';
  for (let line of lines) {
    let i = line.indexOf(DURATION_DELIMITER);
    if (i < 0) {
      // No duration here...
      continue;
    }
    i += DURATION_DELIMITER.length;
    let j = line.indexOf(',', i);
    if (j < 0) {
      // There's no end?
      continue;
    }
    let durationString = line.substring(i, j).trim();
    let [hours, mins, secs] = durationString.split(':');
    let totalSeconds = (Number(hours) * 60 + Number(mins)) * 60 + Number(secs);
    result.duration = totalSeconds;
  }
  return result;
}

/**
 * @param {FFmpeg} ffmpeg
 */
export async function getFFmpegHelp(ffmpeg) {
  let logging = new FFmpegLogging(ffmpeg);
  logging.startCapturing();
  await ffmpeg.exec(['-help']);
  return logging.stopCapturing();
}

/**
 * @param {FFmpeg} ffmpeg
 */
export async function getFFmpegSupportedCodecs(ffmpeg) {
  let logging = new FFmpegLogging(ffmpeg);
  logging.startCapturing();
  await ffmpeg.exec(['-codecs']);
  let lines = logging.stopCapturing();

  const CODECS_LIST_DELIMITER = '-------';
  const CODECS_DEVILS_DELIMITER = 'DEVILS';

  /** @type {Array<string>} */
  let results = [];
  let startIndex = lines.indexOf(CODECS_LIST_DELIMITER);
  if (startIndex < 0) {
    return [];
  }
  for (let i = startIndex; i < lines.length; ++i) {
    let line = lines[i];
    // NOTE: If it is a decoder and is a video codec
    //  from the DEVILS acronym :P
    if (line.charAt(0) === 'D' && line.charAt(2) === 'V') {
      results.push(line.substring(CODECS_DEVILS_DELIMITER.length).trim());
    }
  }
  return results;
}

export class FFmpegLogging {
  /**
   *
   * @param {FFmpeg} ffmpeg
   * @param {boolean} [redirect]
   */
  constructor(ffmpeg, redirect = false) {
    /** @readonly */
    this.ffmpeg = ffmpeg;
    /** @readonly */
    this.redirect = redirect;

    /**
     * @private
     * @type {Array<string>}
     */
    this.captured = [];
    /** @private */
    this.capturing = false;

    /** @private */
    this.onLog = this.onLog.bind(this);

    this.ffmpeg.on('log', this.onLog);
  }

  destroy() {
    this.ffmpeg.off('log', this.onLog);
  }

  /**
   * @param {Array<string>} output
   */
  startCapturing(output = []) {
    this.capturing = true;
    this.captured = output;
  }

  stopCapturing() {
    let result = this.captured;
    this.capturing = false;
    this.captured = [];
    return result;
  }

  /**
   * @private
   * @param {{ type: string, message: string }} e
   */
  onLog(e) {
    if (this.redirect) {
      if (e.type === 'stdout') {
        console.debug('[FFmpeg]', ' ', e.message);
      } else {
        console.error('[FFmpeg]', ' ', e.message);
      }
    }
    if (this.capturing) {
      this.captured.push(e.message.trim());
    }
  }
}
