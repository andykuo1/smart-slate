// @ts-nocheck
import { useRef, useState } from 'react';

export default function TestVideoConstraints() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const [mediaStream, setMediaStream] = useState(
    /** @type {MediaStream|null} */ (null),
  );

  function step1() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => setMediaStream(stream));
  }

  function step2() {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.srcObject = mediaStream;
    console.log('[TestVideoConstraints] Set video!');
  }

  function step3() {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    if (!mediaStream) {
      return;
    }
    const [track] = mediaStream.getVideoTracks();
    const cap = track.getCapabilities();
    const set = track.getSettings();
    console.log(cap, cap.zoom, set.zoom);
    input.min = cap.zoom.min;
    input.max = cap.zoom.max;
    input.step = cap.zoom.step;
    input.value = set.zoom;
    input.hidden = false;
  }

  /** @param {InputEvent} e */
  function onInput(e) {
    if (!mediaStream) {
      return;
    }
    const target = e.target;
    const value = e.target.value;
    const [track] = mediaStream.getVideoTracks();
    track.applyConstraints({
      advanced: [
        {
          zoom: value,
        },
      ],
    });
  }

  return (
    <fieldset className="relative my-4">
      <legend className="absolute -top-4 left-2 text-xl bg-white border rounded px-2">
        TestVideoConstraints
      </legend>
      <ul className="border p-4">
        <li>
          <div>Step 1</div>
          <button onClick={step1}>Open MediaStream</button>
          <video
            ref={videoRef}
            preload="metadata"
            muted={true}
            playsInline={true}
          />
        </li>
        <li>
          <div>Step 2</div>
          <button onClick={step2}>Attach Zoom</button>
        </li>
        <li>
          <div>Step 3</div>
          <button onClick={step3}>Attach Zoom</button>
        </li>
        <li>
          <div>Step 4</div>
          <label>ZOOM</label>
          <input ref={inputRef} type="range" onInput={onInput} hidden={true} />
        </li>
      </ul>
    </fieldset>
  );
}
