import { useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export default function TestTranscode() {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const outputRef = useRef(/** @type {HTMLOutputElement|null} */ (null));

  async function load() {
    console.log('[FFMPEGTranscoder] Loading...');
    // const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd';
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
    let result = await ffmpeg.load();
    console.log('[FFMPEGTranscoder] ...loaded!', result);
    setLoaded(true);
  }

  async function transcode(
    videoURL = 'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi',
  ) {
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile('input.avi', await fetchFile(videoURL));
    await ffmpeg.exec(['-i', 'input.avi', 'output.mp4']);
    const fileData = await ffmpeg.readFile('output.avi');
    const data = new Uint8Array(/** @type {ArrayBuffer} */ (fileData));
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' }),
      );
    }
  }

  function onChange() {}

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
