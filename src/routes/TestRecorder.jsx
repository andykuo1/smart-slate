import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useAnimationFrame } from '@/libs/animationframe';
import {
  useMediaStreamRecorder,
  useMediaStreamRecorderLiveVideo,
} from '@/recorder/UseMediaStreamRecorder';
import { createContext } from '@/utils/ReactContextHelper';
import { formatHourMinSecTime } from '@/utils/StringFormat';
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '@/values/RecorderValues';

/**
 * @param {object} props
 * @param {TestRecorderChangeCallback} [props.onChange]
 */
export default function TestRecorder({ onChange }) {
  return (
    <TestRecorderContextProvider onChange={onChange}>
      <TestRecorderImpl />
    </TestRecorderContextProvider>
  );
}

function TestRecorderImpl() {
  const {
    onStart,
    onStop,
    videoRef,
    isPrepared,
    isRecording,
    videoDeviceId,
    audioDeviceId,
    setVideoDeviceId,
    setAudioDeviceId,
  } = useContext(TestRecorderContext);
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
      setOpen(true);
    } catch (e) {
      // ... report it.
      if (e instanceof Error) {
        window.alert(`${e.name}: ${e.message}`);
      } else {
        console.error(JSON.stringify(e));
      }
      // ... and stop everything if it failed.
      await onStop({ exit: true });
      setOpen(false);
    }
  }

  function onToggle() {
    if (isRecording) {
      onStop({ exit: false, mediaBlobOptions: MEDIA_BLOB_OPTIONS });
    } else {
      onStart({
        // @ts-ignore
        restart: false,
        record: true,
        mediaRecorderOptions: MEDIA_RECORDER_OPTIONS,
      });
    }
  }

  /**
   * @param {string} deviceId
   */
  async function onVideoChange(deviceId) {
    setVideoDeviceId(deviceId);
    await onStop({ exit: true, mediaBlobOptions: MEDIA_BLOB_OPTIONS });
    await onStart({
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
      mediaRecorderOptions: MEDIA_RECORDER_OPTIONS,
    });
  }

  /**
   * @param {string} deviceId
   */
  async function onAudioChange(deviceId) {
    setAudioDeviceId(deviceId);
    await onStop({ exit: true, mediaBlobOptions: MEDIA_BLOB_OPTIONS });
    await onStart({
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
      mediaRecorderOptions: MEDIA_RECORDER_OPTIONS,
    });
  }

  return (
    <fieldset className="relative my-4">
      <legend className="absolute -top-4 left-2 text-xl bg-white border rounded px-2">
        TestRecorder
      </legend>
      <ul className="border p-4">
        <li>
          <div>Step 1</div>
          <button
            onClick={onClick}
            className="border rounded px-2 py-1 bg-gray-300">
            Open Recorder
          </button>
        </li>
        <li>
          <div>Step 2</div>
          <video
            ref={videoRef}
            muted={true}
            playsInline={true}
            className="h-40"
          />
        </li>
        <li>
          <div>Step 3</div>
          <RecordingTime
            active={isPrepared && isRecording}
            className="bg-transparent"
          />
        </li>
        <li>
          <div>Step 4</div>
          <button
            onClick={onToggle}
            className="border rounded px-2 py-1 bg-gray-300">
            Toggle Recording
          </button>
        </li>
        <li>
          <div>Step 5</div>
          <VideoDeviceSelector
            className="bg-transparent"
            value={videoDeviceId}
            onChange={onVideoChange}
          />
        </li>
        <li>
          <div>Step 6</div>
          <AudioDeviceSelector
            className="bg-transparent"
            value={audioDeviceId}
            onChange={onAudioChange}
          />
        </li>
        <li>
          <div>Step 7</div>
          <VideoResolutionSelector className="bg-transparent" />
        </li>
        <li>
          <div>Step 8</div>
          <CheckPermissionsButton />
        </li>
      </ul>
    </fieldset>
  );
}

function CheckPermissionsButton() {
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
  return (
    <button
      onClick={onClick}
      className="border rounded px-2 py-1 bg-gray-300 text-black">
      Check Permissions
    </button>
  );
}

export const TestRecorderContext = createContext(useTestRecorderContextValue);

/**
 * @param {object} props
 * @param {TestRecorderChangeCallback} [props.onChange]
 * @param {import('react').ReactNode} props.children
 */
function TestRecorderContextProvider({ children, onChange }) {
  const value = useTestRecorderContextValue(onChange);
  return (
    <TestRecorderContext.Provider value={value}>
      {children}
    </TestRecorderContext.Provider>
  );
}

/**
 * @callback TestRecorderChangeCallback
 * @param {object} event
 * @param {HTMLVideoElement|null} event.target
 * @param {Blob} event.value
 */

/**
 * @param {TestRecorderChangeCallback} [onChange]
 */
function useTestRecorderContextValue(onChange) {
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

  function onRecord() {}

  /** @type {import('@/recorder/UseMediaRecorder').MediaRecorderCompleteCallback} */
  const onComplete = useCallback(function _onComplete(blob, mediaRecorder) {
    onChange?.({ target: videoRef.current, value: blob });
    const message = `Got ${blob.type}:${blob.size} bytes!`;
    window.alert(message);
  }, []);

  const { onStart, onStop, isPrepared, isRecording, mediaStreamRef } =
    useMediaStreamRecorder(onRecord, onComplete);
  useMediaStreamRecorderLiveVideo(videoRef, mediaStreamRef, isPrepared);

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
 * @param {string} props.value
 * @param {(videoDeviceId: string) => void} props.onChange
 */
function VideoDeviceSelector({ className, value, onChange }) {
  const [deviceList, setDeviceList] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );

  const { isPrepared } = useContext(TestRecorderContext);

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
    <select className={className} value={value} onChange={changeCallback}>
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
 * @param {string} [props.className]
 * @param {string} props.value
 * @param {(audioDeviceId: string) => void} props.onChange
 */
function AudioDeviceSelector({ className, value, onChange }) {
  const [deviceList, setDeviceList] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );

  const { isPrepared } = useContext(TestRecorderContext);

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
    <select className={className} value={value} onChange={changeCallback}>
      {deviceList.map((deviceInfo, index) => (
        <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
          {deviceInfo.label || 'Microphone ' + (index + 1)}
        </option>
      ))}
    </select>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 */
function VideoResolutionSelector({ className }) {
  const [value, setValue] = useState('');

  const { mediaStreamRef, isPrepared } = useContext(TestRecorderContext);

  useEffect(() => {
    if (!isPrepared) {
      return;
    }
    const videoTracks = mediaStreamRef.current?.getVideoTracks();
    if (!videoTracks || videoTracks.length <= 0) {
      return;
    }
    const firstVideoTrack = videoTracks[0];
    let resolution =
      VIDEO_RESOLUTIONS.find((res) => res.name === value) ||
      VIDEO_RESOLUTIONS[0];
    firstVideoTrack.applyConstraints({
      width: { ideal: resolution.width },
      height: { ideal: resolution.height },
      aspectRatio: resolution.ratio === '16:9' ? 16 / 9 : 4 / 3,
    });
  }, [isPrepared, value, mediaStreamRef]);

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function changeCallback(e) {
    const target = e.target;
    const value = target.value;
    setValue(value);
  }

  return (
    <select className={className} value={value} onChange={changeCallback}>
      {VIDEO_RESOLUTIONS.map((resolution) => (
        <option key={resolution.name} value={resolution.name}>
          {resolution.name}
        </option>
      ))}
    </select>
  );
}

const VIDEO_RESOLUTIONS = [
  {
    name: '8K',
    width: 7680,
    height: 4320,
    ratio: '16:9',
  },
  {
    name: '4K',
    width: 3840,
    height: 2160,
    ratio: '16:9',
  },
  {
    name: '1080p',
    width: 1920,
    height: 1080,
    ratio: '16:9',
  },
  {
    name: '720p',
    width: 1280,
    height: 720,
    ratio: '16:9',
  },
  {
    name: 'VGA',
    width: 640,
    height: 480,
    ratio: '4:3',
  },
  {
    name: '360p',
    width: 640,
    height: 360,
    ratio: '16:9',
  },
  {
    name: 'CIF',
    width: 352,
    height: 288,
    ratio: '4:3',
  },
];
