import {
  Button,
  Dialog,
  DialogDescription,
  DialogDismiss,
  DialogHeading,
  DialogProvider,
} from '@ariakit/react';
import { useState } from 'react';

import SettingsIcon from '@material-symbols/svg-400/rounded/settings-fill.svg';

import DialogStyle from '@/styles/Dialog.module.css';
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
} from '@/values/RecorderValues';

import MediaRecorderStartStop from './MediaRecorderStartStop';
import MediaStreamAudioDeviceSelector from './MediaStreamAudioDeviceSelector';
import MediaStreamVideoDeviceSelector from './MediaStreamVideoDeviceSelector';
import MediaStreamVideoResolutionSelector from './MediaStreamVideoResolutionSelector';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {(blob: Blob) => void} props.onComplete
 * @param {(constraints: MediaTrackConstraints) => void} props.onVideoConstraintsChange
 * @param {(constraints: MediaTrackConstraints) => void} props.onAudioConstraintsChange
 */
export default function RecorderToolbar({
  className,
  onComplete,
  onVideoConstraintsChange,
  onAudioConstraintsChange,
}) {
  const [open, setOpen] = useState(false);
  const [videoConstraints, setVideoConstraints] = useState(
    /** @type {MediaTrackConstraints} */ ({}),
  );
  const [_, setAudioConstraints] = useState(
    /** @type {MediaTrackConstraints} */ ({}),
  );

  function onApplyClick() {
    onVideoConstraintsChange(videoConstraints);
    // TODO: onAudioConstraintsChange(audioConstraints);
    setOpen(false);
  }

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
            <div className="flex flex-row gap-2 my-1">
              <label className="whitespace-nowrap">Video Source:</label>
              <MediaStreamVideoDeviceSelector
                className="flex-1"
                onChange={(deviceId) =>
                  setVideoConstraints((prev) => ({
                    ...prev,
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                  }))
                }
              />
            </div>
            <div className="flex flex-row gap-2 my-1">
              <label className="whitespace-nowrap">Audio Source:</label>
              <MediaStreamAudioDeviceSelector
                className="flex-1"
                onChange={(deviceId) =>
                  setAudioConstraints((prev) => ({
                    ...prev,
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                  }))
                }
              />
            </div>
            <div className="flex flex-row gap-2 my-1">
              <label className="whitespace-nowrap">Resolution:</label>
              <MediaStreamVideoResolutionSelector
                className="flex-1"
                onChange={(resolution) =>
                  setVideoConstraints((prev) => ({
                    ...prev,
                    width: { ideal: resolution.width },
                    height: { ideal: resolution.height },
                    aspectRatio: { ideal: resolution.ratio },
                  }))
                }
              />
            </div>
            <div className="flex flex-row gap-2 my-1">
              <label className="whitespace-nowrap">Zoom:</label>
              <button
                className="flex-1 rounded bg-gray-600"
                onClick={() =>
                  setVideoConstraints((prev) => ({
                    ...prev,
                    zoom: { ideal: 0.5 },
                  }))
                }>
                x0.5
              </button>
              <button
                className="flex-1 rounded bg-gray-600"
                onClick={() =>
                  setVideoConstraints((prev) => ({
                    ...prev,
                    zoom: { ideal: 1 },
                  }))
                }>
                x1
              </button>
              <button
                className="flex-1 rounded bg-gray-600"
                onClick={() =>
                  setVideoConstraints((prev) => ({
                    ...prev,
                    zoom: { ideal: 2 },
                  }))
                }>
                x2
              </button>
            </div>
            <div className="flex flex-row gap-2 my-1">
              <button onClick={onApplyClick}>Apply</button>
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
