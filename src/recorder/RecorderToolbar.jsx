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
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
} from '@/values/RecorderValues';

import MediaRecorderStartStop from './MediaRecorderStartStop';
import MediaStreamVideoDeviceSelector from './MediaStreamVideoDeviceSelector';
import MediaStreamVideoResolutionSelector from './MediaStreamVideoResolutionSelector';
import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {(blob: Blob) => void} props.onComplete
 * @param {(constraints: MediaTrackConstraints) => void} props.onVideoConstraintsChange
 */
export default function RecorderToolbar({
  className,
  onComplete,
  onVideoConstraintsChange,
}) {
  const [open, setOpen] = useState(false);

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
            <div className="flex flex-row gap-2 my-1 opacity-30">
              <label className="whitespace-nowrap">Video Source:</label>
              <MediaStreamVideoDeviceSelector
                className="flex-1"
                onChange={(deviceId) =>
                  onVideoConstraintsChange({ deviceId: { exact: deviceId } })
                }
              />
            </div>
            <div className="flex flex-row gap-2 my-1 opacity-30">
              <label className="whitespace-nowrap">Audio Source:</label>
              <AudioDeviceSelector
                className="flex-1"
                value={''}
                onChange={() => {}}
                disabled={true}
              />
            </div>
            <div className="flex flex-row gap-2 my-1">
              <label className="whitespace-nowrap">Resolution:</label>
              <MediaStreamVideoResolutionSelector
                className="flex-1"
                onChange={(resolution) =>
                  onVideoConstraintsChange({
                    width: { ideal: resolution.width },
                    height: { ideal: resolution.height },
                    aspectRatio: { ideal: resolution.ratio },
                  })
                }
              />
            </div>
            <div className="flex flex-row gap-2 my-1">
              <label className="whitespace-nowrap">Zoom:</label>
              <button
                className="flex-1 rounded bg-gray-600"
                onClick={() =>
                  // @ts-expect-error Zoom exists for Safari.
                  onVideoConstraintsChange({ zoom: { ideal: 0.5 } })
                }>
                x0.5
              </button>
              <button
                className="flex-1 rounded bg-gray-600"
                onClick={() =>
                  // @ts-expect-error Zoom exists for Safari.
                  onVideoConstraintsChange({ zoom: { ideal: 1 } })
                }>
                x1
              </button>
              <button
                className="flex-1 rounded bg-gray-600"
                onClick={() =>
                  // @ts-expect-error Zoom exists for Safari.
                  onVideoConstraintsChange({ zoom: { ideal: 2 } })
                }>
                x2
              </button>
            </div>
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
