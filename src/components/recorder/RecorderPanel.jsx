import { useCallback, useEffect, useRef } from 'react';

import RecorderStatus from '@/stores/RecorderStatus';
import {
  useCurrentRecorder,
  useSetRecorderActive,
  useSetRecorderStatus,
} from '@/stores/UserStoreContext';

import {
  getMediaRecorderSupportedMimeType,
  tryValidateMediaRecorderFeatures,
  useMediaRecorder,
} from './UseMediaRecorder';

/**
 * @callback MediaRecorderChangeEventHandler
 * @param {object} e
 * @param {import('./UseMediaRecorder').MediaRecorderStatus} e.status
 * @param {Blob|null} e.data
 */

const MEDIA_RECORDER_POSSIBLE_MIME_TYPES = [
  'video/mp4',
  'video/ogg',
  'video/webm',
  'video/quicktime',
];
const MEDIA_RECORDER_SUPPORTED_MIME_TYPE =
  getMediaRecorderSupportedMimeType(MEDIA_RECORDER_POSSIBLE_MIME_TYPES) ||
  MEDIA_RECORDER_POSSIBLE_MIME_TYPES[0];

/** @type {MediaRecorderOptions} */
const MEDIA_RECORDER_OPTIONS = {
  mimeType: MEDIA_RECORDER_SUPPORTED_MIME_TYPE,
};
/** @type {MediaStreamConstraints} */
const MEDIA_STREAM_CONSTRAINTS = {
  video: {
    facingMode: 'environment',
  },
  audio: true,
};
/** @type {BlobPropertyBag} */
const MEDIA_BLOB_OPTIONS = {
  type: MEDIA_RECORDER_SUPPORTED_MIME_TYPE,
};

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
      onChange({ status: 'stopped', data: blob });
    },
    [videoRef, onChange],
  );
  const onStatus = useCallback(
    /** @param {import('./UseMediaRecorder').MediaRecorderStatus} status */
    function onStatus(status) {
      setRecorderStatus(status);
      onChange({ status, data: null });
    },
    [setRecorderStatus, onChange],
  );

  const { startRecording, stopRecording } = useMediaRecorder({
    mediaRecorderOptions: MEDIA_RECORDER_OPTIONS,
    blobOptions: MEDIA_BLOB_OPTIONS,
    mediaStreamConstraints: MEDIA_STREAM_CONSTRAINTS,
    onStart,
    onStop,
    onStatus,
  });

  const { inputRef, startCapturing } = useInputCapture();

  const onInputCaptureChange = useCallback(
    /** @type {MediaRecorderChangeEventHandler} */
    function onInputCaptureChange(e) {
      onChange(e);
      setRecorderActive(false, false);
    },
    [onChange, setRecorderActive],
  );

  useEffect(() => {
    if (recorder.active && recorder.forceStart) {
      setRecorderActive(true, false);
      if (
        isMediaRecorderSupported(
          MEDIA_RECORDER_OPTIONS,
          MEDIA_STREAM_CONSTRAINTS,
        )
      ) {
        startRecording();
      } else {
        startCapturing();
      }
    }
  }, [recorder, setRecorderActive, startRecording, startCapturing]);

  return (
    <div className="relative flex flex-col items-center bg-black w-full h-full">
      <VideoInputCapture inputRef={inputRef} onChange={onInputCaptureChange} />
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

function useInputCapture() {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const startCapturing = useCallback(
    function startCapturing() {
      inputRef.current?.click();
    },
    [inputRef],
  );
  return {
    inputRef,
    startCapturing,
  };
}

function isInputCaptureSupported() {
  return (
    typeof document !== 'undefined' &&
    typeof document.createElement('input').capture !== 'undefined'
  );
}

/**
 * @param {MediaRecorderOptions} mediaRecorderOptions
 * @param {MediaStreamConstraints} mediaStreamConstraints
 */
function isMediaRecorderSupported(
  mediaRecorderOptions,
  mediaStreamConstraints,
) {
  try {
    tryValidateMediaRecorderFeatures(
      mediaRecorderOptions,
      mediaStreamConstraints,
    );
  } catch {
    return false;
  }
  return true;
}

/**
 * @param {object} props
 * @param {import('react').RefObject<HTMLInputElement>} props.inputRef
 * @param {MediaRecorderChangeEventHandler} props.onChange
 */
function VideoInputCapture({ inputRef, onChange }) {
  const onChangeImpl = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function _onChangeImpl(e) {
      const el = /** @type {HTMLInputElement} */ (e.target);
      const file = el.files?.[0];
      if (!file) {
        return;
      }
      el.value = '';
      onChange({ status: 'stopped', data: file });
    },
    [onChange],
  );

  return (
    <input
      ref={inputRef}
      className="hidden"
      type="file"
      accept="video/*"
      capture="environment"
      onChange={onChangeImpl}
    />
  );
}
