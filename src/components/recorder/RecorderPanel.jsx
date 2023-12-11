import { useCallback, useEffect, useRef } from 'react';

import RecorderStatus from '@/stores/RecorderStatus';
import {
  useCurrentRecorder,
  useSetRecorderActive,
  useSetRecorderStatus,
} from '@/stores/UserStoreContext';

import { useMediaRecorder } from './UseMediaRecorder';

/**
 * @callback MediaRecorderChangeEventHandler
 * @param {object} e
 * @param {import('./UseMediaRecorder').MediaRecorderStatus} e.status
 * @param {string} e.data
 */

/**
 * @param {object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {MediaRecorderChangeEventHandler} props.onChange
 */
export default function RecorderPanel({ children, onChange }) {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const recorder = useCurrentRecorder();
  const setRecorderActive = useSetRecorderActive();
  const setRecorderStatus = useSetRecorderStatus();

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
      onChange({ status: 'stopped', data: url });
    },
    [videoRef, onChange],
  );
  const onStatus = useCallback(
    /** @param {import('./UseMediaRecorder').MediaRecorderStatus} status */
    function onStatus(status) {
      setRecorderStatus(status);
      onChange({ status, data: '' });
    },
    [onChange],
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

  useEffect(() => {
    if (recorder.active && recorder.forceStart) {
      setRecorderActive(true, false);
      startRecording();
    }
  }, [recorder, setRecorderActive]);

  return (
    <div className="relative flex flex-col items-center bg-black w-full h-full">
      <div className="flex-1" />
      <video className="w-full h-full bg-neutral-900" ref={videoRef} />
      <div className="flex-1" />
      <div className="absolute bottom-0 left-0 right-0 flex flex-row">
        <button
          className="bg-red-500 p-4 py-6 m-2 rounded-full disabled:opacity-30"
          onClick={() => startRecording()}
          disabled={
            !recorder.active || !RecorderStatus.isDone(recorder.status)
          }>
          Another Take?
        </button>
        <div className="flex-1" />
        <button
          className="bg-white p-4 m-2 disabled:opacity-30"
          onClick={() => stopRecording()}
          disabled={
            !recorder.active || !RecorderStatus.isRecording(recorder.status)
          }>
          CUT!
        </button>
      </div>
      {children}
    </div>
  );
}

/**
 * @param {string} value
 */
function isStartingOrRecording(value) {
  return value === 'starting' || value === 'recording';
}

/**
 * @param {string} value
 */
function isStopped(value) {
  return value === 'stopped';
}
