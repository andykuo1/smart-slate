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

  return (
    <div className={'flex h-full w-20 flex-col items-center' + ' ' + className}>
      <div className="flex-1" />
      <DialogProvider>
        <Button onClick={() => setOpen(true)}>
          <SettingsIcon className="h-10 fill-current" />
        </Button>
        <Dialog
          className={DialogStyle.dialog}
          open={open}
          onClose={() => setOpen(false)}>
          <DialogDismiss className="text-left text-xl">Back</DialogDismiss>
          <DialogHeading className="text-center text-4xl">
            Settings
          </DialogHeading>
          <DialogDescription className="text-center text-gray-400">
            The configurations for the recorder.
          </DialogDescription>
          <fieldset className="my-4">
            <div className="my-1 flex flex-row gap-2">
              <label className="whitespace-nowrap">Video Source:</label>
              <MediaStreamVideoDeviceSelector
                className="flex-1"
                onChange={() => {}}
              />
            </div>
            <div className="my-1 flex flex-row gap-2">
              <label className="whitespace-nowrap">Audio Source:</label>
              <MediaStreamAudioDeviceSelector
                className="flex-1"
                onChange={() => {}}
              />
            </div>
            <div className="my-1 flex flex-row gap-2">
              <label className="whitespace-nowrap">Resolution:</label>
              <MediaStreamVideoResolutionSelector
                className="flex-1"
                onChange={() => {}}
              />
            </div>
            <div className="my-1 flex flex-row gap-2">
              <label className="whitespace-nowrap">Zoom:</label>
              <button
                className="flex-1 rounded bg-gray-600"
                onClick={() =>
                  onVideoConstraintsChange({
                    // @ts-expect-error Zoom exists for Safari.
                    zoom: { exact: 0.5 },
                  })
                }>
                x0.5
              </button>
              <button
                className="flex-1 rounded bg-gray-600"
                onClick={() =>
                  onVideoConstraintsChange({
                    // @ts-expect-error Zoom exists for Safari.
                    zoom: { exact: 1.0 },
                  })
                }>
                x1
              </button>
              <button
                className="flex-1 rounded bg-gray-600"
                onClick={() =>
                  onVideoConstraintsChange({
                    // @ts-expect-error Zoom exists for Safari.
                    zoom: { exact: 2.0 },
                  })
                }>
                x2
              </button>
            </div>
          </fieldset>
        </Dialog>
      </DialogProvider>
      <div className="flex-1" />
      <MediaRecorderStartStop
        className="text-4xl text-red-500"
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
