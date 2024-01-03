import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useAnimationFrame } from '@/libs/animationframe';
import { useRecorderV2 } from '@/recorder';
import VideoRecorderBoothLayout from '@/recorder/VideoRecorderBoothLayout';
import { downloadURLImpl } from '@/utils/Downloader';
import { createContext, createProvider } from '@/utils/ReactContextHelper';
import { formatHourMinSecTime } from '@/utils/StringFormat';
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '@/values/RecorderValues';

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
  }, [open]);

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

/**
 * @param {object} props
 * @param {string} props.value
 * @param {(videoDeviceId: string) => void} props.onChange
 */
function VideoDeviceSelector({ value, onChange }) {
  const [deviceList, setDeviceList] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );

  const { isPrepared } = useContext(MediaRecorderV2Context);

  useEffect(() => {
    if (!isPrepared) {
      setDeviceList([]);
      return;
    }
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
  }, [setDeviceList, isPrepared]);

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function changeCallback(e) {
    const target = e.target;
    const value = target.value;
    onChange(value);
  }

  return (
    <select value={value} onChange={changeCallback}>
      {deviceList.map((deviceInfo, index) => (
        <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
          {deviceInfo.label || 'Camera ' + (index + 1)}
        </option>
      ))}
    </select>
  );
}

/**
 * @param {object} props
 * @param {string} props.value
 * @param {(audioDeviceId: string) => void} props.onChange
 */
function AudioDeviceSelector({ value, onChange }) {
  const [deviceList, setDeviceList] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );

  const { isPrepared } = useContext(MediaRecorderV2Context);

  useEffect(() => {
    if (!isPrepared) {
      setDeviceList([]);
      return;
    }
    if (
      typeof window !== 'undefined' &&
      typeof window?.navigator?.mediaDevices?.enumerateDevices === 'function'
    ) {
      window.navigator.mediaDevices
        .enumerateDevices()
        .then((infos) =>
          setDeviceList(infos.filter((info) => info.kind === 'audioinput')),
        );
      return () => setDeviceList([]);
    }
  }, [setDeviceList, isPrepared]);

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function changeCallback(e) {
    const target = e.target;
    const value = target.value;
    onChange(value);
  }

  return (
    <select value={value} onChange={changeCallback}>
      {deviceList.map((deviceInfo, index) => (
        <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
          {deviceInfo.label || 'Microphone ' + (index + 1)}
        </option>
      ))}
    </select>
  );
}

function PermissionsButton() {
  function onClick() {
    navigator.permissions
      // @ts-ignore
      .query({ name: 'microphone' })
      .then((result) =>
        window.alert(JSON.stringify(result) + `${result.name}${result.state}`),
      )
      .catch((e) => window.alert('ERROR'));
    navigator.permissions
      // @ts-ignore
      .query({ name: 'camera' })
      .then((result) =>
        window.alert(JSON.stringify(result) + `${result.name}${result.state}`),
      )
      .catch((e) => window.alert('ERROR'));
  }
  return <button onClick={onClick}>Permissions</button>;
}

const MediaRecorderV2Context = createContext(useMediaRecorderV2ContextValue);
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
  const {
    videoRef,
    onStart,
    onStop,
    isPrepared,
    isRecording,
    videoDeviceId,
    audioDeviceId,
    setVideoDeviceId,
    setAudioDeviceId,
  } = useContext(MediaRecorderV2Context);

  async function onLoad() {
    await onStart({
      record: false,
      /** @type {MediaStreamConstraints} */
      mediaStreamConstraints: {
        video: false,
        audio: true,
      },
      mediaRecorderOptions: { mimeType: 'video/mp4' },
    });
  }
  function onUnload() {
    onStop({ exit: true, mediaBlobOptions: { type: 'video/mp4' } });
  }

  /**
   * @param {string} deviceId
   */
  function onVideoChange(deviceId) {
    setVideoDeviceId(deviceId);
    onStop({ exit: true, mediaBlobOptions: { type: 'video/mp4' } });
    onStart({
      record: false,
      mediaStreamConstraints: {
        video: {
          facingMode: 'environment',
          deviceId: { ideal: deviceId },
        },
        audio: {
          deviceId: { ideal: audioDeviceId },
        },
      },
      mediaRecorderOptions: { mimeType: 'video/mp4' },
    });
  }

  /**
   * @param {string} deviceId
   */
  function onAudioChange(deviceId) {
    setAudioDeviceId(deviceId);
    onStop({ exit: true, mediaBlobOptions: { type: 'video/mp4' } });
    onStart({
      record: false,
      mediaStreamConstraints: {
        video: {
          facingMode: 'environment',
          deviceId: { ideal: videoDeviceId },
        },
        audio: {
          deviceId: { ideal: deviceId },
        },
      },
      mediaRecorderOptions: { mimeType: 'video/mp4' },
    });
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
          <VideoDeviceSelector value={videoDeviceId} onChange={onVideoChange} />
          <AudioDeviceSelector value={audioDeviceId} onChange={onAudioChange} />
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
          <RecordAndCutButton
            canCut={isPrepared && isRecording}
            canRec={isPrepared && !isRecording}
            onClick={() => {
              if (!isPrepared) {
                return;
              }
              if (!isRecording) {
                onStart({
                  record: true,
                  mediaRecorderOptions: { mimeType: 'video/mp4' },
                });
              } else {
                onStop({
                  exit: false,
                  mediaBlobOptions: { type: 'video/mp4' },
                });
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
