import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFullscreen } from '@/lib/fullscreen';
import {
  getMediaRecorderSupportedMimeType,
  isMediaRecorderSupported,
  useMediaRecorder,
} from '@/lib/mediarecorder';
import RecorderStatus from '@/stores/RecorderStatus';
import {
  useCurrentRecorder,
  useSetRecorderActive,
  useSetRecorderStatus,
} from '@/stores/UserStoreContext';

/**
 * @callback MediaRecorderChangeEventHandler
 * @param {object} e
 * @param {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} e.status
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
export const MEDIA_RECORDER_OPTIONS = {
  mimeType: MEDIA_RECORDER_SUPPORTED_MIME_TYPE,
};
/** @type {MediaStreamConstraints} */
export const MEDIA_STREAM_CONSTRAINTS = {
  video: {
    facingMode: 'environment',
    width: { ideal: 7680 },
    height: { ideal: 4320 },
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
  const [muted, _] = useState(true); // Consider allowing sound when with headphones
  const recorder = useCurrentRecorder();
  const setRecorderActive = useSetRecorderActive();
  const setRecorderStatus = useSetRecorderStatus();
  const navigate = useNavigate();
  const { exitFullscreen } = useFullscreen();

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
      video.play().catch((e) => console.error(e));
    },
    [videoRef],
  );

  const onStop = useCallback(
    /** @param {Blob} blob */
    function onStop(blob) {
      if (videoRef.current) {
        let video = videoRef.current;
        if (!video.paused) {
          video.pause();
        }
        video.srcObject = null;
      }
      onChange({ status: 'stopped', data: blob });
      setRecorderActive(false, false);
      navigate('/edit');
      exitFullscreen();
    },
    [videoRef, onChange, exitFullscreen, navigate, setRecorderActive],
  );

  const onStatus = useCallback(
    /** @param {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} status */
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
      }
    }
  }, [recorder, setRecorderActive, startRecording]);

  return (
    <div className="relative flex flex-col items-center bg-black w-full h-full">
      <div className="flex-1" />
      <video
        className="w-full h-full bg-neutral-900"
        ref={videoRef}
        muted={muted}
      />
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
          title="Cut"
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
