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

/*
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-features=SharedArrayBuffer
*/

export default function TestTranscode() {
  const [enableSnapshot, setEnableSnapshot] = useState(false);
  const ffmpegRef = useRef(/** @type {FFmpeg|null} */ (null));
  const ffmpegLoggingRef = useRef(/** @type {FFmpegLogging|null} */ (null));
  const outputQRCodesRef = useRef(/** @type {HTMLPreElement|null} */ (null));
  const outputProgressRef = useRef(/** @type {HTMLPreElement|null} */ (null));
  const outputProgressLinesRef = useRef(/** @type {Array<string>} */ ([]));
  const outputSupportedVideoCodecsRef = useRef(
    /** @type {HTMLPreElement|null} */ (null),
  );

  async function load() {
    const ffmpeg = new FFmpeg();
    // const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    const logging = new FFmpegLogging(ffmpeg, true);

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
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
      console.error('[TestTranscode] Failed to start ffmpeg!');
    } else {
      console.log('[TestTranscode] FFmpeg is ready!');
    }

    let supportedCodecs = await getFFmpegSupportedCodecs(ffmpeg);
    console.log(
      '[TestTranscode] Supports video codecs: ',
      supportedCodecs.join('\n'),
    );
    let outputSupportedVideoCodecs = outputSupportedVideoCodecsRef.current;
    if (outputSupportedVideoCodecs) {
      outputSupportedVideoCodecs.textContent =
        'TOTAL: ' +
        supportedCodecs.length +
        ' codecs\n\n' +
        supportedCodecs.join('\n');
    }

    ffmpegRef.current = ffmpeg;
    ffmpegLoggingRef.current = logging;
  }

  async function transcode() {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) {
      console.log('[TestTranscode] Not yet loaded.');
      return;
    }

    console.log('[TestTranscode] Try transcoding...');

    outputProgressLinesRef.current.length = 0;
    outputProgressLinesRef.current.push('Starting...');
    if (outputProgressRef.current) {
      outputProgressRef.current.textContent =
        outputProgressLinesRef.current.join('\n');
    }

    // @ts-ignore
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Input videos',
          accept: {
            'image/*': [
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
    const startTime = Date.now();
    const file = await fileHandle.getFile();

    const inputDir = '/input';
    const inputName = inputDir + '/' + file.name;

    await ffmpeg.createDir(inputDir);
    await ffmpeg.mount(
      // @ts-ignore
      'WORKERFS',
      {
        files: [file],
      },
      inputDir,
    );

    // get metadata
    let { duration } = await getFFmpegVideoMetadata(ffmpeg, inputName);
    console.log('[TestTranscode] Duration: ', duration, ' seconds');

    // scrub and scan for qr code
    let qrCodes = [];
    for (let i = 0; i < duration; ++i) {
      console.log('[TestTranscode] Getting frame at ' + i + ' sec');
      outputProgressLinesRef.current.push('Getting frame at ' + i + ' sec...');
      if (outputProgressRef.current) {
        outputProgressRef.current.textContent =
          outputProgressLinesRef.current.join('\n');
      }
      let secs = String(i % 60).padStart(2, '0');
      let mins = String(Math.floor(i / 60) % 60).padStart(2, '0');
      let hours = String(Math.floor(i / 60 / 60)).padStart(2, '0');
      let timeString = `${hours}:${mins}:${secs}`;

      const outputName = 'output.jpg';
      const outputType = 'image/jpg';
      console.log('[TestTranscode] ', timeString);
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
      const result = await ffmpeg.readFile(outputName);
      await ffmpeg.deleteFile(outputName);

      let blob = new Blob([result], { type: outputType });
      let blobUrl = URL.createObjectURL(blob);

      console.log('[TestTranscode] ', blobUrl);
      console.log('[TestTranscode] Scanning frame...');
      outputProgressLinesRef.current.push('Scanning frame...');
      if (outputProgressRef.current) {
        outputProgressRef.current.textContent =
          outputProgressLinesRef.current.join('\n');
      }

      if (enableSnapshot) {
        downloadURLImpl('at_' + i + '_' + outputName, blobUrl);
      }

      const qrCodeText = await scanImageURLForQRCode(blobUrl);
      if (!qrCodeText) {
        console.log('[TestTranscode] No QR code found...');
        outputProgressLinesRef.current.push('No qr code found...');
        if (outputProgressRef.current) {
          outputProgressRef.current.textContent =
            outputProgressLinesRef.current.join('\n');
        }
      } else {
        console.log('[TestTranscode] FOUND QR CODE! ' + qrCodeText);
        qrCodes.push(qrCodeText);
        outputProgressLinesRef.current.push('YES qr code!');
        if (outputProgressRef.current) {
          outputProgressRef.current.textContent =
            outputProgressLinesRef.current.join('\n');
        }
        console.log('[TestTranscode] Stopping now...');
        break;
      }
    }

    let outputQRCode = outputQRCodesRef.current;
    if (outputQRCode) {
      outputQRCode.textContent =
        'TOTAL: ' + qrCodes.length + ' qr code(s)\n\n' + qrCodes.join('\n');
    }

    // Clean-up
    ffmpeg.unmount(inputDir);
    ffmpeg.deleteDir(inputDir);

    const stopTime = Date.now();

    const deltaTime = (stopTime - startTime) / 1_000;
    outputProgressLinesRef.current.push(
      'DONE! Took ' +
        deltaTime +
        ' seconds for ' +
        duration +
        ' seconds of footage.',
    );
    if (outputProgressRef.current) {
      outputProgressRef.current.textContent =
        outputProgressLinesRef.current.join('\n');
    }
  }

  async function onLoadClick() {
    try {
      await load();
    } catch (e) {
      console.error(e);
    }
  }

  async function onTranscodeClick() {
    try {
      await transcode();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <fieldset className="relative my-4">
      <legend className="absolute -top-4 left-2 text-xl bg-white border rounded px-2">
        TestTranscode
      </legend>
      <ul className="border p-4">
        <li>
          <div className="font-bold text-xl">Step 1</div>
          <button className="block rounded border-2 m-2" onClick={onLoadClick}>
            Load
          </button>
          <div>
            <h3 className="font-bold text-md">Supported Video Codecs</h3>
            <pre
              ref={outputSupportedVideoCodecsRef}
              className="overflow-auto w-64 h-32">
              --empty--
            </pre>
          </div>
        </li>
        <li>
          <div className="font-bold text-xl">Step 2</div>
          <button
            className="block border rounded p-2 m-2 bg-gray-100"
            onClick={() => setEnableSnapshot((prev) => !prev)}>
            {enableSnapshot ? 'Download' : 'Ignore'} snapshots
          </button>
          <button
            onClick={onTranscodeClick}
            className="block border rounded p-2 m-2 bg-gray-100">
            Transcode!
          </button>
          <pre className="overflow-y-auto h-20" ref={outputProgressRef}>
            --empty--
          </pre>
        </li>
        <li>
          <div className="font-bold text-xl">Step 3</div>
          <pre ref={outputQRCodesRef}>--empty--</pre>
        </li>
      </ul>
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

  /** @type {Array<string>} */
  let results = [];
  let startIndex = lines.indexOf('-------');
  if (startIndex < 0) {
    return [];
  }
  for (let i = startIndex; i < lines.length; ++i) {
    let line = lines[i];
    // NOTE: If it has a decoder and is a video codec
    //  from the DEVILS acronym :P
    if (line.charAt(0) === 'D' && line.charAt(2) === 'V') {
      results.push(line);
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
