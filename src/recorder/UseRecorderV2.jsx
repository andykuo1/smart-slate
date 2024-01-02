import { useCallback, useState } from 'react';

import { useMediaRecorder } from './UseMediaRecorder';
import { useMediaStream } from './UseMediaStream';

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @param {import('./UseMediaRecorder').MediaRecorderCompleteCallback} onComplete
 */
export function useRecorderV2(videoRef, onComplete) {
  const [isPrepared, setIsPrepared] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [mediaStreamRef, initMediaStream, deadMediaStream] =
    useMediaStream(videoRef);
  const [_, startMediaRecorder, stopMediaRecorder] = useMediaRecorder(
    mediaStreamRef,
    onComplete,
  );

  const onStart = useCallback(
    /**
     * @param {object} opts
     * @param {boolean} opts.record
     * @param {MediaStreamConstraints|Array<MediaStreamConstraints>} [opts.mediaStreamConstraints]
     * @param {MediaRecorderOptions} [opts.mediaRecorderOptions]
     */
    async function onStart({
      record,
      mediaStreamConstraints,
      mediaRecorderOptions,
    }) {
      try {
        await initMediaStream(mediaStreamConstraints);
        setIsPrepared(true);
        if (record) {
          await startMediaRecorder(mediaRecorderOptions);
          setIsRecording(true);
        }
      } catch (e) {
        // TODO: Errors are just consumed :( what are all the possible errors for media recorder?
        console.error(e);
      }
    },
    [initMediaStream, setIsPrepared, startMediaRecorder, setIsRecording],
  );

  const onStop = useCallback(
    /**
     * @param {object} opts
     * @param {boolean} opts.exit
     * @param {BlobPropertyBag} [opts.mediaBlobOptions]
     */
    async function onStop({ exit, mediaBlobOptions = undefined }) {
      try {
        await stopMediaRecorder(mediaBlobOptions);
        setIsRecording(false);
        if (exit) {
          await deadMediaStream();
          setIsPrepared(false);
        }
      } catch (e) {
        // TODO: Errors are just consumed :( what are all the possible errors for media recorder?
        console.error(e);
      }
    },
    [stopMediaRecorder, setIsRecording, deadMediaStream, setIsPrepared],
  );

  return {
    onStart,
    onStop,
    isPrepared,
    isRecording,
  };
}
