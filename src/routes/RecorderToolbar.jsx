import {
  Button,
  Dialog,
  DialogDescription,
  DialogDismiss,
  DialogHeading,
  DialogProvider,
} from '@ariakit/react';
import { useContext, useEffect, useState } from 'react';

import SettingsIcon from '@material-symbols/svg-400/rounded/settings-fill.svg';

import DialogStyle from '@/styles/Dialog.module.css';

import { MediaRecorderV2Context } from './TestPage';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function RecorderToolbar({ className }) {
  const [open, setOpen] = useState(false);
  const {
    onStart,
    onStop,
    videoDeviceId,
    audioDeviceId,
    setVideoDeviceId,
    setAudioDeviceId,
  } = useContext(MediaRecorderV2Context);

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
    <div className="w-20 h-full flex flex-col items-center">
      <div className="flex-1" />
      <DialogProvider>
        <Button onClick={() => setOpen(true)}>
          <SettingsIcon className="h-10 fill-current" />
        </Button>
        <Dialog
          className={DialogStyle.dialog}
          open={open}
          onClose={() => setOpen(false)}>
          <DialogDismiss className="text-xl text-left">Back</DialogDismiss>
          <DialogHeading className="text-4xl text-center">
            Settings
          </DialogHeading>
          <DialogDescription className="text-gray-400 text-center">
            The configurations for the recorder.
          </DialogDescription>
          <fieldset className="my-4">
            <div className="flex flex-row">
              <label className="px-2 whitespace-nowrap">Video Source:</label>
              <VideoDeviceSelector
                className="flex-1"
                value={videoDeviceId}
                onChange={onVideoChange}
              />
            </div>
            <div className="flex flex-row">
              <label className="px-2 whitespace-nowrap">Audio Source:</label>
              <AudioDeviceSelector
                className="flex-1"
                value={audioDeviceId}
                onChange={onAudioChange}
              />
            </div>
            <div className="flex flex-row">
              <label className="px-2 whitespace-nowrap">Resolution:</label>
              <VideoResolutionSelector className="flex-1" />
            </div>
          </fieldset>
        </Dialog>
      </DialogProvider>
      <div className="flex-1" />
      <RecordButton />
      <div className="flex-1" />
      <div className="h-10" />
      <div className="flex-1" />
    </div>
  );
}

function RecordButton() {
  return <button className="text-red-500 text-4xl">◉</button>;
}

/**
 * @param {object} props
 * @param {string} props.className
 */
function VideoResolutionSelector({ className }) {
  const [value, setValue] = useState('');

  const { mediaStreamRef, isPrepared } = useContext(MediaRecorderV2Context);

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
    <select className={className} value={value} onChange={changeCallback}>
      {deviceList.map((deviceInfo, index) => (
        <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
          {deviceInfo.label || 'Microphone ' + (index + 1)}
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
