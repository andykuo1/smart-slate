import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useAnimationFrame } from '@/libs/animationframe';
import { useRecorderV2 } from '@/recorder/UseRecorderV2';
import VideoRecorderBoothLayout from '@/recorder/VideoRecorderBoothLayout';
import { downloadURLImpl } from '@/utils/Downloader';
import { createContext, createProvider } from '@/utils/ReactContextHelper';
import { formatHourMinSecTime } from '@/utils/StringFormat';
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '@/values/RecorderValues';

import RecorderToolbar from './RecorderToolbar';

/**
 * What should happen is you click the O button, it requests permissions, then it navigates the recording booth with the proper permissions.
 * Otherwise, it alerts. This permission state is saved in the provider context, so that should persist across pages?
 */

const TEST_VERSION = 'v16';

export default function TestPage() {
  return (
    <main className="w-full h-full flex flex-col items-center bg-black text-white">
      <MediaRecorderV2Provider>
        <TestPageContent />
      </MediaRecorderV2Provider>
    </main>
  );
}

function TestPageContent() {
  const { onStart, onStop } = useContext(MediaRecorderV2Context);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      onStop({ exit: true });
    }
  }, [open, onStop]);

  async function onClick() {
    try {
      // Step 1. Get all the permissions :P
      await onStart({
        record: false,
        mediaStreamConstraints: [
          {
            video: { facingMode: 'environment' },
            audio: true,
          },
        ],
      });
      // Step 2. Navigate to page.
      setOpen((prev) => !prev);
    } catch (e) {
      // ... report it.
      if (e instanceof Error) {
        window.alert(`${e.name}: ${e.message}`);
      } else {
        console.error(JSON.stringify(e));
      }
      // ... and stop everything if it failed.
      await onStop({ exit: true });
    }
  }
  return (
    <>
      {!open && <VideoBoothButton onClick={onClick} />}
      {open && <App />}
    </>
  );
}

/**
 * @param {object} props
 * @param {() => void} props.onClick
 */
function VideoBoothButton({ onClick }) {
  return (
    <button
      className="absolute left-0 top-0 right-0 bottom-0 z-50 text-red-500 text-9xl"
      onClick={onClick}>
      ◉
    </button>
  );
}

function PermissionsButton() {
  function onClick() {
    navigator.permissions
      // @ts-expect-error 'microphone' is a permissable feature.
      .query({ name: 'microphone' })
      .then((result) =>
        window.alert(JSON.stringify(result) + `${result.name}${result.state}`),
      )
      .catch((e) => window.alert('ERROR'));
    navigator.permissions
      // @ts-expect-error 'camera' is a permissable feature.
      .query({ name: 'camera' })
      .then((result) =>
        window.alert(JSON.stringify(result) + `${result.name}${result.state}`),
      )
      .catch((e) => window.alert('ERROR'));
  }
  return <button onClick={onClick}>Permissions</button>;
}

export const MediaRecorderV2Context = createContext(
  useMediaRecorderV2ContextValue,
);
const MediaRecorderV2Provider = createProvider(
  MediaRecorderV2Context,
  useMediaRecorderV2ContextValue,
);
function useMediaRecorderV2ContextValue() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const [videoDeviceId, setVideoDeviceId] = useState('');
  const [audioDeviceId, setAudioDeviceId] = useState('');
  const [mediaStreamConstraints, setMediaStreamConstraints] = useState(
    MEDIA_STREAM_CONSTRAINTS,
  );
  const [mediaRecorderOptions, setMediaRecorderOptions] = useState(
    MEDIA_RECORDER_OPTIONS,
  );
  const [mediaBlobOptions, setMediaBlobOptions] = useState(MEDIA_BLOB_OPTIONS);

  /** @type {import('@/recorder/UseMediaRecorder').MediaRecorderCompleteCallback} */
  const onComplete = useCallback(function _onComplete(blob, mediaRecorder) {
    const dataURL = URL.createObjectURL(blob);
    downloadURLImpl('Untitled.mp4', dataURL);
    URL.revokeObjectURL(dataURL);

    const message = `Got ${blob.type}:${blob.size} bytes!`;
    window.alert(message);
  }, []);

  const { onStart, onStop, isPrepared, isRecording, mediaStreamRef } =
    useRecorderV2(videoRef, onComplete);

  return {
    videoRef,
    mediaStreamRef,
    onStart,
    onStop,
    isPrepared,
    isRecording,
    mediaStreamConstraints,
    mediaRecorderOptions,
    mediaBlobOptions,
    videoDeviceId,
    audioDeviceId,
    setMediaBlobOptions,
    setMediaRecorderOptions,
    setMediaStreamConstraints,
    setVideoDeviceId,
    setAudioDeviceId,
  };
}

function App() {
  const { videoRef, isPrepared, isRecording } = useContext(
    MediaRecorderV2Context,
  );

  return (
    <VideoRecorderBoothLayout
      videoRef={videoRef}
      top={() => (
        <>
          <p>{TEST_VERSION}</p>
          <PermissionsButton />
        </>
      )}
      center={({ className }) => (
        <VideoFrame
          className={'border-4' + ' ' + className}
          videoRef={videoRef}
          active={isPrepared && isRecording}
        />
      )}
      bottom={() => (
        <>
          <div className="flex-1" />
          <RecordingTime active={isPrepared && isRecording} />
          <div className="flex-1" />
        </>
      )}
      right={() => <RecorderToolbar />}
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLVideoElement|null>} props.videoRef
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} props.active
 */
function VideoFrame({ className, videoRef, active, children }) {
  return (
    <>
      <video
        ref={videoRef}
        className={className}
        muted={true}
        playsInline={true}
      />
      <>{children}</>
    </>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} props.active
 */
function RecordingTime({ className, active }) {
  const [startTime, setStartTime] = useState(-1);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    if (active && startTime < 0) {
      setStartTime(Date.now());
    } else if (!active) {
      setStartTime(-1);
    }
  }, [active, startTime]);

  const onAnimationFrame = useCallback(
    function _onAnimationFrame() {
      if (startTime > 0) {
        setTimeString(formatHourMinSecTime(Date.now() - startTime));
      }
    },
    [startTime],
  );

  useAnimationFrame(onAnimationFrame);
  return (
    <output
      className={
        'rounded p-1 font-mono transition-colors' +
        ' ' +
        (active ? 'bg-red-400' : 'bg-black') +
        ' ' +
        className
      }>
      {startTime > 0 ? timeString : '00:00:00'}
    </output>
  );
}
