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

import { useSettingsStore } from '@/stores/settings';
import DialogStyle from '@/styles/Dialog.module.css';
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
} from '@/values/RecorderValues';

import MediaRecorderStartStop from './MediaRecorderStartStop';
import MediaStreamVideoResolutionSelector from './MediaStreamVideoResolutionSelector';
import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {(blob: Blob) => void} props.onComplete
 * @param {(resolution: import('@/values/Resolutions').VideoResolution) => void} props.onResolutionChange
 */
export default function RecorderToolbar({
  className,
  onComplete,
  onResolutionChange,
}) {
  const [open, setOpen] = useState(false);
  const { videoDeviceId, audioDeviceId } = useContext(RecorderContext);
  const show4x3Box = useSettingsStore((ctx) => ctx.user.show4x3Box);
  const setShow4x3Box = useSettingsStore((ctx) => ctx.setShow4x3Box);

  return (
    <div className={'w-20 h-full flex flex-col items-center' + ' ' + className}>
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
            <div className="flex flex-row opacity-30">
              <label className="px-2 whitespace-nowrap">Video Source:</label>
              <VideoDeviceSelector
                className="flex-1"
                value={videoDeviceId}
                onChange={() => {}}
                disabled={true}
              />
            </div>
            <div className="flex flex-row opacity-30">
              <label className="px-2 whitespace-nowrap">Audio Source:</label>
              <AudioDeviceSelector
                className="flex-1"
                value={audioDeviceId}
                onChange={() => {}}
                disabled={true}
              />
            </div>
            <div className="flex flex-row">
              <label className="px-2 whitespace-nowrap">Resolution:</label>
              <MediaStreamVideoResolutionSelector
                className="flex-1"
                onChange={onResolutionChange}
              />
            </div>
            <button
              className="flex-1 my-2 w-full whitespace-nowrap bg-neutral-700"
              onClick={() => {
                setShow4x3Box(!show4x3Box);
                setOpen(false);
              }}>
              Show 4:3 Box
            </button>
          </fieldset>
        </Dialog>
      </DialogProvider>
      <div className="flex-1" />
      <MediaRecorderStartStop
        className="text-red-500 text-4xl"
        mediaRecorderOptions={MEDIA_RECORDER_OPTIONS}
        blobOptions={MEDIA_BLOB_OPTIONS}
        onStop={(recorder, blob) => {
          if (blob) {
            onComplete(blob);
          }
        }}>
        ◉
      </MediaRecorderStartStop>
      <div className="flex-1" />
      <div className="h-10" />
      <div className="flex-1" />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.value
 * @param {boolean} [props.disabled]
 * @param {(videoDeviceId: string) => void} props.onChange
 */
function VideoDeviceSelector({ className, value, disabled, onChange }) {
  const [deviceList, setDeviceList] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );

  const { isPrepared } = useContext(RecorderContext);

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
    <select
      className={className}
      value={value}
      onChange={changeCallback}
      disabled={disabled}>
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
 * @param {boolean} [props.disabled]
 * @param {(audioDeviceId: string) => void} props.onChange
 */
function AudioDeviceSelector({ className, value, disabled, onChange }) {
  const [deviceList, setDeviceList] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );

  const { isPrepared } = useContext(RecorderContext);

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
    <select
      className={className}
      value={value}
      onChange={changeCallback}
      disabled={disabled}>
      {deviceList.map((deviceInfo, index) => (
        <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
          {deviceInfo.label || 'Microphone ' + (index + 1)}
        </option>
      ))}
    </select>
  );
}
