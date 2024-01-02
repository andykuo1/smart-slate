import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAnimationFrame } from '@/libs/animationframe';
import { useFullscreen } from '@/libs/fullscreen';
import { useRecorderV2 } from '@/recorder';
import VideoRecorderBoothLayout from '@/recorder/VideoRecorderBoothLayout';
import { createContext, createProvider } from '@/utils/ReactContextHelper';
import { formatHourMinSecTime } from '@/utils/StringFormat';
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '@/values/RecorderValues';

const TEST_VERSION = 'v3';

export default function TestPage() {
  return (
    <main className="w-full h-full flex flex-col items-center bg-black text-white">
      <MediaRecorderV2Provider>
        <App />
      </MediaRecorderV2Provider>
    </main>
  );
}

function VideoDeviceSelector() {
  const [deviceList, setDeviceList] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window?.navigator?.mediaDevices?.enumerateDevices === 'function'
    ) {
      window.navigator.mediaDevices
        .enumerateDevices()
        .then((infos) =>
          setDeviceList(infos.filter((info) => info.kind === 'videoinput')),
        );
      return () => setDeviceList([]);
    }
  }, [setDeviceList]);

  return (
    <select>
      {deviceList.map((deviceInfo, index) => (
        <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
          {deviceInfo.label || 'Camera ' + (index + 1)}
        </option>
      ))}
    </select>
  );
}

const MediaRecorderV2Context = createContext(useMediaRecorderV2ContextValue);
const MediaRecorderV2Provider = createProvider(
  MediaRecorderV2Context,
  useMediaRecorderV2ContextValue,
);
function useMediaRecorderV2ContextValue() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const [mediaStreamConstraints, setMediaStreamConstraints] = useState(
    MEDIA_STREAM_CONSTRAINTS,
  );
  const [mediaRecorderOptions, setMediaRecorderOptions] = useState(
    MEDIA_RECORDER_OPTIONS,
  );
  const [mediaBlobOptions, setMediaBlobOptions] = useState(MEDIA_BLOB_OPTIONS);

  /** @type {import('@/recorder/UseMediaRecorder').MediaRecorderCompleteCallback} */
  const onComplete = useCallback(function _onComplete(blob, mediaRecorder) {
    const message = `Got ${blob.type}:${blob.size} bytes!`;
    window.alert(message);
  }, []);

  const { onStart, onStop, isPrepared, isRecording } = useRecorderV2(
    videoRef,
    onComplete,
  );

  return {
    videoRef,
    onStart,
    onStop,
    isPrepared,
    isRecording,
    mediaStreamConstraints,
    mediaRecorderOptions,
    mediaBlobOptions,
    setMediaBlobOptions,
    setMediaRecorderOptions,
    setMediaStreamConstraints,
  };
}

function App() {
  const preferPersistedMediaStream = false;
  const navigate = useNavigate();
  const { exitFullscreen } = useFullscreen();

  const { videoRef, onStart, onStop, isPrepared, isRecording } = useContext(
    MediaRecorderV2Context,
  );

  function onLoad() {
    onStart({
      record: false,
      mediaStreamConstraints: { video: true, audio: false },
      mediaRecorderOptions: { mimeType: 'video/mp4' },
    });
  }
  function onUnload() {
    onStop({ exit: true });
  }

  return (
    <VideoRecorderBoothLayout
      videoRef={videoRef}
      top={() => (
        <>
          <p>{TEST_VERSION}</p>
          <button className="bg-gray-800 p-2 m-2" onClick={onLoad}>
            LOAD
          </button>
          <button className="bg-gray-800 p-2 m-2" onClick={onUnload}>
            STOP
          </button>
          <BackButton
            onClick={() => {
              onStop({ exit: !preferPersistedMediaStream }).then(() => {
                exitFullscreen();
                navigate('/edit');
              });
            }}
          />
          <VideoDeviceSelector />
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
          <RecordAndCutButton
            canCut={isPrepared && isRecording}
            canRec={isPrepared && !isRecording}
            onClick={() => {
              if (!isPrepared) {
                return;
              }
              if (!isRecording) {
                onStart({ record: true });
              } else {
                onStop({ exit: false });
              }
            }}
          />
        </>
      )}
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 */
function BackButton({ className, onClick }) {
  return (
    <button className={'rounded mx-2' + ' ' + className} onClick={onClick}>
      {'<-'}Back
    </button>
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
  const preferMutedWhileRecording = true;
  return (
    <>
      <video
        ref={videoRef}
        className={className}
        muted={preferMutedWhileRecording}
      />
      <>{children}</>
      <div className="absolute right-0 bottom-0">
        <RecordingTime active={active} />
      </div>
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

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} props.canCut
 * @param {boolean} props.canRec
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 */
function RecordAndCutButton({ className, canCut, canRec, onClick }) {
  return (
    <button
      className={'flex flex-row items-center mx-2' + ' ' + className}
      onClick={onClick}>
      <span
        className={
          'text-xl text-white' + ' ' + (canCut ? 'opacity-100' : 'opacity-30')
        }>
        cut
      </span>
      <span className="mx-2 text-3xl text-red-400">◉</span>
      <span
        className={
          'text-xl text-red-400' + ' ' + (canRec ? 'opacity-100' : 'opacity-30')
        }>
        rec
      </span>
    </button>
  );
}
