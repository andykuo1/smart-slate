import { useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

import { scanImageURLForQRCode } from '@/scanner/QRCodeReader';

/*
// "@diffusion-studio/ffmpeg-js": "^0.2.3",
import { FFmpeg } from '@diffusion-studio/ffmpeg-js';

async function load() {
  const ffmpeg = new FFmpeg();
  ffmpeg.whenReady(async () => {
    ffmpegRef.current = ffmpeg;
    await ffmpeg.exec(['-help']);
  });
}

async function transcode() {
  const ffmpeg = ffmpegRef.current;
  if (!ffmpeg) {
    return;
  }

  const inputName = 'input.mov';
  const outputName = 'output.mp4';
  const outputType = 'video/mp4';

  // write to fs
  await ffmpeg.writeFile(inputName, blobURLRef.current);
  await ffmpeg.exec(['-i', inputName, outputName]);
  const result = ffmpeg.readFile(outputName);
  ffmpeg.deleteFile(inputName);
  ffmpeg.deleteFile(outputName);

  // download
  let outBlob = new Blob([result], { type: outputType });
  let outBlobURL = URL.createObjectURL(outBlob);
  downloadURLImpl(outputName, outBlobURL);
}
*/
import { downloadURLImpl } from '@/utils/Downloader';

import TestStep from './components/TestStep';

/*
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-features=SharedArrayBuffer
*/

export default function TestFFmpegTranscode() {
  const [enableSnapshot, setEnableSnapshot] = useState(false);
  const ffmpegRef = useRef(/** @type {FFmpeg|null} */ (null));
  const ffmpegLoggingRef = useRef(/** @type {FFmpegLogging|null} */ (null));
  const fileDataRef = useRef(/** @type {File|null} */ (null));
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));

  return (
    <fieldset className="relative my-4 border">
      <legend className="absolute -top-4 left-2 text-xl bg-white border rounded px-2">
        TestFFmpegTranscode
      </legend>
      <TestStep
        title="Step 1 - Load FFmpeg"
        onExecute={async function* () {
          const ffmpeg = new FFmpeg();
          // const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
          const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
          const logging = new FFmpegLogging(ffmpeg, true);

          await ffmpeg.load({
            coreURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.js`,
              'text/javascript',
            ),
            wasmURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.wasm`,
              'application/wasm',
            ),
            /*
            workerURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.worker.js`,
              'text/javascript',
            ),
            */
          });

          if ((await getFFmpegHelp(ffmpeg)).length <= 0) {
            yield 'Failed to start ffmpeg!';
          } else {
            yield 'FFmpeg is ready!';
          }

          let supportedCodecs = await getFFmpegSupportedCodecs(ffmpeg);
          yield `TOTAL: ${
            supportedCodecs.length
          } codecs\n\n${supportedCodecs.join('\n')}`;
          'Supports video codecs: ' + supportedCodecs.join('\n');
          ffmpegRef.current = ffmpeg;
          ffmpegLoggingRef.current = logging;
        }}
      />
      <TestStep
        title="Step 2 - Select video file"
        onExecute={async function* () {
          yield 'Opening file picker...';
          // @ts-expect-error showOpenFilePicker is supported in chrome.
          const [fileHandle] = await window.showOpenFilePicker({
            types: [
              {
                description: 'Input videos',
                accept: {
                  'video/*': [
                    '.mp4',
                    '.m4v',
                    '.webm',
                    '.avi',
                    '.mkv',
                    '.mov',
                    '.wmv',
                  ],
                },
              },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
          });
          yield 'Loading file...';
          /** @type {File} */
          const file = await fileHandle.getFile();
          fileDataRef.current = file;
        }}
      />
      <TestStep
        title="Step 3 - Test video"
        onExecute={async function* () {
          const video = videoRef.current;
          if (!video) {
            yield 'Video element not yet loaded.';
            return;
          }
          const file = fileDataRef.current;
          if (!file) {
            yield 'No file selected.';
            return;
          }
          let result = false;
          let blobUrl = '';
          try {
            blobUrl = URL.createObjectURL(file);
            let event = new Promise((resolve, reject) => {
              video.addEventListener('loadedmetadata', () => {
                resolve('loadedmetadata');
              });
              video.src = blobUrl;
              video.play().then(resolve).catch(reject);
            });
            yield `Got result: ${await event}`;
            result = true;
          } catch (e) {
            let err = /** @type {any} */ (e);
            yield `ERROR ${err.name}: ${err.message}`;
            result = false;
          } finally {
            URL.revokeObjectURL(blobUrl);
          }
          if (result) {
            yield '\nCOMPLETE! This is a playable video. We should skip transcoding.\n';
          } else {
            yield '\nCOMPLETE! This is NOT a playable video. We should use FFmpeg to transcode.\n';
          }
        }}>
        <video className="outline" ref={videoRef} muted={true} />
      </TestStep>
      <TestStep
        title="Step 4 - Transcode video"
        onExecute={async function* () {
          const ffmpeg = ffmpegRef.current;
          if (!ffmpeg) {
            yield 'FFmpeg is not yet loaded.';
            return;
          }

          const file = fileDataRef.current;
          if (!file) {
            yield 'No file selected.';
            return;
          }

          const startTime = Date.now();
          const inputDir = '/input';
          const inputName = inputDir + '/' + file.name;

          await ffmpeg.createDir(inputDir);
          await ffmpeg.mount(
            // @ts-expect-error WORKERFS is supported in chrome.
            'WORKERFS',
            {
              files: [file],
            },
            inputDir,
          );

          yield 'Getting video metadata...';
          // get metadata
          let { duration } = await getFFmpegVideoMetadata(ffmpeg, inputName);
          yield `Got duration: ${duration} second(s)\n\n`;

          // scrub and scan for qr code
          yield 'Scanning video frames...';
          let qrCodes = [];
          for (let i = 0; i < duration; ++i) {
            yield `Getting frame at ${i} sec...`;
            let secs = String(i % 60).padStart(2, '0');
            let mins = String(Math.floor(i / 60) % 60).padStart(2, '0');
            let hours = String(Math.floor(i / 60 / 60)).padStart(2, '0');
            let timeString = `${hours}:${mins}:${secs}`;

            const outputName = 'output.jpg';
            const outputType = 'image/jpg';
            yield `...at video time ${timeString}...`;
            await ffmpeg.exec([
              '-ss',
              timeString,
              '-i',
              inputName,
              '-frames:v',
              '1',
              '-q:v',
              '30',
              outputName,
            ]);
            yield `...reading output...`;
            const result = await ffmpeg.readFile(outputName);
            await ffmpeg.deleteFile(outputName);

            let blob = new Blob([result], { type: outputType });
            let blobUrl = '';
            try {
              blobUrl = URL.createObjectURL(blob);
              yield `...to blob ${blobUrl}.`;

              yield `Scanning frame...`;
              if (enableSnapshot) {
                yield `...and downloading snapshot...`;
                downloadURLImpl('at_' + i + '_' + outputName, blobUrl);
              }

              const qrCodeText = await scanImageURLForQRCode(blobUrl);
              if (!qrCodeText) {
                yield `...no qr code not found :( keep going...`;
              } else {
                yield `...FOUND QR CODE! :D => '${qrCodeText}'...`;
                qrCodes.push(qrCodeText);
                yield '...stop scanning now.';
                break;
              }
            } finally {
              URL.revokeObjectURL(blobUrl);
            }
          }
          yield '...scanning stopped.';
          yield `TOTAL: ${qrCodes.length} qr code(s) found\n\n${qrCodes.join(
            '\n',
          )}\n`;

          yield 'Cleaning up...';
          // Clean-up
          ffmpeg.unmount(inputDir);
          ffmpeg.deleteDir(inputDir);

          const stopTime = Date.now();
          const deltaTime = (stopTime - startTime) / 1_000;
          yield `COMPLETE! Took ${deltaTime} seconds for ${duration} seconds of video.`;
        }}>
        <button
          className="block outline rounded p-2 m-2 bg-gray-100"
          onClick={() => setEnableSnapshot((prev) => !prev)}>
          {enableSnapshot ? 'Download' : 'Ignore'} snapshots
        </button>
      </TestStep>
    </fieldset>
  );
}

/**
 * @param {FFmpeg} ffmpeg
 * @param {string} fsFileName
 */
async function getFFmpegVideoMetadata(ffmpeg, fsFileName) {
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
async function getFFmpegHelp(ffmpeg) {
  let logging = new FFmpegLogging(ffmpeg);
  logging.startCapturing();
  await ffmpeg.exec(['-help']);
  return logging.stopCapturing();
}

/**
 * @param {FFmpeg} ffmpeg
 */
async function getFFmpegSupportedCodecs(ffmpeg) {
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

class FFmpegLogging {
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
