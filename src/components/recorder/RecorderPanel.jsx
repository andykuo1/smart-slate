import { useCallback, useRef, useState } from 'react';

import { useMediaRecorder } from './UseMediaRecorder';

/**
 * @param {object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {(url: string) => void} props.onChange
 */
export default function RecorderPanel({ children, onChange }) {
  const [status, setStatus] = useState(
    /** @type {import('./UseMediaRecorder').MediaRecorderStatus} */ ('idle'),
  );
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const onStart = useCallback(
    /** @param {MediaRecorder} mediaRecorder */
    function onStart(mediaRecorder) {
      if (!videoRef.current) {
        return;
      }
      let video = videoRef.current;
      video.srcObject = mediaRecorder.stream;
      let videoTrackSettings = mediaRecorder.stream
        .getVideoTracks()
        .at(0)
        ?.getSettings();
      if (videoTrackSettings) {
        video.width = videoTrackSettings.width || 0;
        video.height = videoTrackSettings.height || 0;
      }
      video.play();
    },
    [videoRef],
  );
  const onStop = useCallback(
    /** @param {Blob} blob */
    function onStop(blob) {
      if (videoRef.current) {
        let video = videoRef.current;
        video.pause();
        video.srcObject = null;
      }
      let url = URL.createObjectURL(blob);
      onChange(url);
    },
    [videoRef, onChange],
  );
  const onStatus = useCallback(
    /** @param {import('./UseMediaRecorder').MediaRecorderStatus} status */
    function onStatus(status) {
      setStatus(status);
    },
    [setStatus],
  );
  const { startRecording, stopRecording } = useMediaRecorder({
    blobOptions: {
      type: 'video/webm',
    },
    mediaStreamConstraints: {
      video: {
        facingMode: 'environment',
      },
      audio: true,
    },
    onStart,
    onStop,
    onStatus,
  });

  return (
    <div className="relative flex flex-col items-center bg-black w-full h-full">
      <div className="flex-1" />
      <video className="w-full h-full bg-neutral-900" ref={videoRef} />
      <div className="flex-1" />
      <div className="absolute bottom-0 left-0 right-0 flex flex-row">
        <button
          className="bg-red-500 p-4 py-6 m-2 rounded-full"
          onClick={() => startRecording()}>
          Start
        </button>
        <div className="flex-1" />
        <button
          className="bg-white p-4 py-6 m-2"
          onClick={() => stopRecording()}>
          Stop
        </button>
      </div>
      <p className="absolute bottom-8 left-0 right-0 text-white text-center pointer-events-none">
        Status: {JSON.stringify(status)}
      </p>
      {children}
    </div>
  );
}
