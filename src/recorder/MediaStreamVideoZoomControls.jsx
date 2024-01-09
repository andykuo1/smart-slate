import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useRef } from 'react';

import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function MediaStreamVideoZoomControls({ className }) {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const [zoomValue, setZoomValue] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const { mediaStream } = useContext(RecorderContext);

  /** @type {import('react').FormEventHandler<HTMLInputElement>} */
  function onInput(e) {
    if (!mediaStream) {
      return;
    }
    const target = /** @type {HTMLInputElement} */ (e.target);
    const value = target.value;
    const [track] = mediaStream.getVideoTracks();
    track.applyConstraints({
      advanced: [
        {
          // @ts-expect-error Zoom is supported on Safari.
          zoom: value,
        },
      ],
    });
  }

  useEffect(() => {
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
    if (!('zoom' in cap)) {
      if (!disabled) {
        setDisabled(true);
      }
      return;
    }
    const zoom = /** @type {{ min: number, max: number, step: number }} */ (
      cap.zoom
    );
    input.min = String(zoom.min);
    input.max = String(zoom.max);
    input.step = String(zoom.step);
    if ('zoom' in set) {
      let currentZoom = Number(set.zoom);
      if (zoomValue !== currentZoom) {
        setZoomValue(currentZoom);
      }
    }
    if (disabled) {
      setDisabled(false);
    }
  }, [inputRef, mediaStream, disabled, zoomValue]);

  return (
    <input
      ref={inputRef}
      type="range"
      className={className + ' ' + '-rotate-90 disabled:opacity-30'}
      value={zoomValue}
      onInput={onInput}
      disabled={disabled}
    />
  );
}
