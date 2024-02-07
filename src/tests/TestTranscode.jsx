import { useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function TestTranscode() {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const blobRef = useRef(/** @type {Blob|null} */ (null));
  const blobURLRef = useRef('');
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const outputRef = useRef(/** @type {HTMLOutputElement|null} */ (null));

  async function load() {
    console.log('[FFMPEGTranscoder] Loading...', window.isSecureContext);
    const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      console.log('[FFMPEGTranscoder] Log:', message);
      if (outputRef.current) {
        outputRef.current.textContent = message;
      }
    });
    ffmpeg.on('progress', ({ progress }) => {
      console.log('[FFMPEGTranscoder] Progress:', progress);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    let result = await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        'text/javascript',
      ),
    });
    console.log('[FFMPEGTranscoder] ...loaded!', result);
    setLoaded(true);
  }

  async function transcode() {
    const blob = blobRef.current;
    if (!blob) {
      console.error('No blob');
      return;
    }
    const url = blobURLRef.current;
    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.mov', await fetchFile(blob));
      await ffmpeg.exec(['-i', 'input.mov', 'output.mp4']);
      const fileData = await ffmpeg.readFile('output.mp4');
      // @ts-ignore
      videoRef.current.src = URL.createObjectURL(
        // @ts-ignore
        new Blob([fileData.buffer], { type: 'video/mp4' }),
      );
    } catch (e) {
      console.error(e);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * @type {import('react').ChangeEventHandler<HTMLInputElement>}
   */
  function onChange(e) {
    const el = /** @type {HTMLInputElement} */ (e.target);
    const file = el.files?.[0];
    if (!file) {
      return;
    }
    el.value = '';
    blobRef.current = file;
    blobURLRef.current = URL.createObjectURL(file);
    console.log('loaded file!');
    // videoRef.current.src = blobURLRef.current;
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
          <div>Step 1</div>
          <button onClick={onLoadClick}>Load</button>
        </li>
        <li>
          <div>Step 2</div>
          <input
            ref={inputRef}
            type="file"
            capture="environment"
            onChange={onChange}
          />
        </li>
        <li>
          <div>Step 3</div>
          <video
            ref={videoRef}
            preload="metadata"
            muted={true}
            playsInline={true}
            controls={true}
          />
          <button
            disabled={!loaded}
            onClick={onTranscodeClick}
            className="border rounded px-2 py-1 bg-gray-300">
            Transcode it!
          </button>
        </li>
        <li>
          <div>Step 4</div>
          <output ref={outputRef}></output>
        </li>
      </ul>
    </fieldset>
  );
}
