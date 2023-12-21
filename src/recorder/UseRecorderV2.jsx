import { useState } from 'react';

import { useMediaRecorder } from './UseMediaRecorder';
import { useMediaStream } from './UseMediaStream';

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @param {MediaStreamConstraints} mediaStreamConstraints
 * @param {MediaRecorderOptions} mediaRecorderOptions
 * @param {BlobPropertyBag} mediaBlobOptions
 * @param {import('./UseMediaRecorder').MediaRecorderCompleteCallback} onComplete
 */
export function useRecorderV2(
  videoRef,
  mediaStreamConstraints,
  mediaRecorderOptions,
  mediaBlobOptions,
  onComplete,
) {
  const [isPrepared, setIsPrepared] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStreamRef, initMediaStream, deadMediaStream] =
    useMediaStream(videoRef);
  const [_, startMediaRecorder, stopMediaRecorder] = useMediaRecorder(
    mediaStreamRef,
    onComplete,
  );

  /**
   * @param {object} opts
   * @param {boolean} opts.record
   */
  async function onStart({ record }) {
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
  }

  /**
   * @param {object} opts
   * @param {boolean} opts.exit
   */
  async function onStop({ exit }) {
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
  }

  return {
    onStart,
    onStop,
    isPrepared,
    isRecording,
  };
}
