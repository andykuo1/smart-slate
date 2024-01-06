import { useContext, useState } from 'react';

import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {() => void} [props.onClick]
 * @param {(recorder: MediaRecorder) => void} [props.onStart]
 * @param {(recorder: MediaRecorder|null, blob: Blob|null) => void} [props.onStop]
 * @param {MediaRecorderOptions} props.mediaRecorderOptions
 * @param {BlobPropertyBag} props.blobOptions
 * @param {import('react').ReactNode} props.children
 */
export default function MediaRecorderStartStop({
  className,
  disabled,
  children,
  mediaRecorderOptions,
  blobOptions,
  onClick,
  onStart,
  onStop,
}) {
  const { mediaStream, mediaRecorder, startMediaRecorder, stopMediaRecorder } =
    useContext(RecorderContext);
  const [pending, setPending] = useState(false);

  function handleClick() {
    if (!mediaStream) {
      return;
    }
    setPending(true);
    if (!mediaRecorder) {
      startMediaRecorder(mediaRecorderOptions)
        .then((result) => onStart?.(result.target))
        .finally(() => setPending(false));
    } else {
      stopMediaRecorder(blobOptions)
        .then((result) => onStop?.(result.target, result.value))
        .finally(() => setPending(false));
    }
    onClick?.();
  }

  return (
    <button
      className={className + ' ' + 'disabled:opacity-30'}
      onClick={handleClick}
      disabled={disabled || pending}
      title="Start recording">
      {children}
    </button>
  );
}
