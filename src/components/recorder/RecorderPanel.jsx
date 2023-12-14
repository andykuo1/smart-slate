import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import BackIcon from '@material-symbols/svg-400/rounded/arrow_back-fill.svg';

import FancyButton from '@/lib/FancyButton';
import { useFullscreen } from '@/lib/fullscreen';
import RecorderStatus from '@/stores/RecorderStatus';
import {
  useCurrentRecorder,
  useSetRecorderActive,
  useSetRecorderStatus,
  useSetUserCursor,
} from '@/stores/UserStoreContext';

import {
  getMediaRecorderSupportedMimeType,
  isMediaRecorderSupported,
  useMediaRecorder,
} from './UseMediaRecorder';
import { VideoInputCapture, useInputCapture } from './VideoInputCapture';

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
  const { enterFullscreen, exitFullscreen, fullscreenTargetRef } =
    useFullscreen();
  const setRecorderActive = useSetRecorderActive();
  const setRecorderStatus = useSetRecorderStatus();
  const navigate = useNavigate();

  const onStart = useCallback(
    /** @param {MediaRecorder} mediaRecorder */
    function onStart(mediaRecorder) {
      if (!videoRef.current) {
        return;
      }
      let video = videoRef.current;
      video.srcObject = mediaRecorder.stream;
      let videoTrackSettings = mediaRecorder.stream
        .getVideoTracks()?.[0]
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
      exitFullscreen();
      navigate('/edit');
    },
    [onChange, setRecorderActive, exitFullscreen],
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
      enterFullscreen();
    }
  }, [
    recorder,
    setRecorderActive,
    startRecording,
    startCapturing,
    enterFullscreen,
  ]);

  return (
    <div
      ref={fullscreenTargetRef}
      className="relative flex flex-col items-center bg-black w-full h-full">
      <VideoInputCapture inputRef={inputRef} onChange={onInputCaptureChange} />
      <div className="flex-1" />
      <video className="w-full h-full bg-neutral-900" ref={videoRef} />
      <div className="flex-1" />
      <DarkHomeButton
        className="absolute top-0 left-0"
        disabled={!recorder.active || !RecorderStatus.isDone(recorder.status)}
      />
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
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */
function DarkHomeButton({ className, disabled }) {
  const setUserCursor = useSetUserCursor();
  const recorderActive = useCurrentRecorder()?.active || false;
  const setRecorderActive = useSetRecorderActive();
  const { exitFullscreen } = useFullscreen();
  const navigate = useNavigate();

  function onReturnHomeClick() {
    if (recorderActive) {
      setRecorderActive(false, false);
      navigate('/edit');
    } else {
      // NOTE: This goes all the way to root.
      setUserCursor('', '', '', '');
      navigate('/');
    }
    exitFullscreen();
  }

  return (
    <div className={'fixed m-2 z-10' + ' ' + className}>
      <FancyButton
        className="to-gray-900 text-white enabled:hover:to-gray-800"
        title="Back"
        disabled={disabled}
        onClick={onReturnHomeClick}>
        <BackIcon className="inline w-6 fill-current" />
      </FancyButton>
    </div>
  );
}
