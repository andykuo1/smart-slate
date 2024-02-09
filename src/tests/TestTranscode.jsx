import { useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

import { scanImageURLForQRCode } from '@/scanner/QRCodeReader';

/*
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
  const outputQRCodesRef = useRef(/** @type {HTMLPreElement|null} */ (null));
  const outputProgressRef = useRef(/** @type {HTMLPreElement|null} */ (null));
  const outputProgressLinesRef = useRef(/** @type {Array<string>} */ ([]));
  const outputSupportedVideoCodecsRef = useRef(
    /** @type {HTMLPreElement|null} */ (null),
  );

  async function load() {
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    ffmpeg.on('log', (e) => {
      switch (e.type) {
        case 'stdout':
          console.log('[FFMPEG] ', e.message);
          break;
        case 'stderr':
        default:
          console.error('[FFMPEG] ', e.message);
          break;
      }
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    });
    await ffmpeg.exec(['-help']);

    /** @type {Array<string>} */
    let lines = [];
    /**
     * @param {any} e
     */
    function onFFMPEGLog(e) {
      lines.push(e.message.trim());
    }
    ffmpeg.on('log', onFFMPEGLog);
    await ffmpeg.exec(['-codecs']);
    ffmpeg.off('log', onFFMPEGLog);
    let i = lines.indexOf('-------');
    if (i >= 0) {
      let results = [];
      for (let j = i; j < lines.length; ++j) {
        let line = lines[j];
        if (line.startsWith('D') && line.charAt(2) === 'V') {
          results.push(line);
        }
      }
      console.log(
        '[TestTranscode] Supports video codecs: ',
        results.join('\n'),
      );
      let outputSupportedVideoCodecs = outputSupportedVideoCodecsRef.current;
      if (outputSupportedVideoCodecs) {
        outputSupportedVideoCodecs.textContent =
          'TOTAL: ' + results.length + ' codecs\n\n' + results.join('\n');
      }
    }

    ffmpegRef.current = ffmpeg;
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
    let logs = /** @type {Array<string>} */ ([]);
    /** @param {any} e */
    function onFFMPEGLog(e) {
      logs.push(e.message);
    }
    ffmpeg.on('log', onFFMPEGLog);
    await ffmpeg.exec(['-i', inputName]);
    ffmpeg.off('log', onFFMPEGLog);
    let durationLog = logs.find((line) => line.includes('Duration'));
    if (!durationLog) {
      console.error('[TestTranscode] ======= did not work :(');
      return;
    }
    const DURATION = 'Duration:';
    let i = durationLog.indexOf(DURATION) + DURATION.length;
    let j = durationLog.indexOf(',', i);
    if (i < 0 || j < 0) {
      console.error('[TestTranscode] ====== could not find duration.');
      return;
    }
    let durationTimeString = durationLog.substring(i, j).trim();
    const [hours, mins, secs] = durationTimeString.split(':');
    let durationSecs = (Number(hours) * 60 + Number(mins)) * 60 + Number(secs);
    console.log('[TestTranscode] ====== ' + durationSecs);

    let qrCodes = [];
    for (let i = 0; i < durationSecs; ++i) {
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

      const outputName = 'output.png';
      const outputType = 'image/png';
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
      }
    }

    let outputQRCode = outputQRCodesRef.current;
    if (outputQRCode) {
      outputQRCode.textContent =
        'TOTAL: ' + qrCodes.length + ' qr codes\n\n' + qrCodes.join('\n');
    }

    // Clean-up
    ffmpeg.unmount(inputDir);
    ffmpeg.deleteDir(inputDir);

    outputProgressLinesRef.current.push('DONE!');
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
              className="overflow-y-auto h-32">
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
