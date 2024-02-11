import { useRef, useState } from 'react';

import {
  captureVideoSnapshot,
  prepareVideoWithBlob,
} from '@/recorder/snapshot/VideoSnapshot';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

export default function TestSnapshot() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const inputRef = useRef(null);
  const blobRef = useRef(/** @type {Blob|null} */ (null));
  const [imgSrc, setImgSrc] = useState('');

  /** @type {import('react').ChangeEventHandler<any>} */
  function onChange(e) {
    const el = /** @type {HTMLInputElement} */ (e.target);
    const file = el.files?.[0];
    if (!file) {
      return;
    }
    el.value = '';
    blobRef.current = file;
    prepareVideoWithBlob(videoRef, file);
  }

  function onClick() {
    const videoBlob = blobRef.current;
    if (!videoBlob) {
      return;
    }
    captureVideoSnapshot(
      videoRef,
      0.5,
      MAX_THUMBNAIL_WIDTH,
      MAX_THUMBNAIL_HEIGHT,
    )?.then((url) => setImgSrc(url));
  }
  return (
    <fieldset className="relative my-4">
      <legend className="absolute -top-4 left-2 rounded border bg-white px-2 text-xl">
        TestSnapshot
      </legend>
      <ul className="border p-4">
        <li>
          <div>Step 1</div>
          <input
            ref={inputRef}
            type="file"
            capture="environment"
            onChange={onChange}
          />
        </li>
        <li>
          <div>Step 2</div>
          <video
            ref={videoRef}
            preload="metadata"
            muted={true}
            playsInline={true}
            controls={true}
          />
          <button
            onClick={onClick}
            className="rounded border bg-gray-300 px-2 py-1">
            Take Snapshot
          </button>
        </li>
        <li>
          <div>Step 3</div>
          <img src={imgSrc} />
        </li>
      </ul>
    </fieldset>
  );
}
