import { useCallback, useEffect, useState } from 'react';

import { useMediaRecorder } from './UseMediaRecorder';
import { useMediaStream } from './UseMediaStream';

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @param {import('./UseMediaRecorder').MediaRecorderCompleteCallback} onComplete
 */
export function useRecorderV2(videoRef, onComplete) {
  const [isPrepared, setIsPrepared] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [mediaStreamRef, initMediaStream, deadMediaStream] = useMediaStream();
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
      await initMediaStream(mediaStreamConstraints);
      setIsPrepared(true);
      if (record) {
        await startMediaRecorder(mediaRecorderOptions);
        setIsRecording(true);
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
      await stopMediaRecorder(mediaBlobOptions);
      setIsRecording(false);
      if (exit) {
        await deadMediaStream();
        setIsPrepared(false);
      }
    },
    [stopMediaRecorder, setIsRecording, deadMediaStream, setIsPrepared],
  );

  useEffect(() => {
    if (mediaStreamRef.current) {
      // Add stream to output video
      if (videoRef.current && !videoRef.current.srcObject) {
        let video = videoRef.current;
        video.srcObject = mediaStreamRef.current;
        video.play();
      }
    } else {
      // Remove stream from output video
      if (videoRef.current && videoRef.current.srcObject) {
        let video = videoRef.current;
        video.pause();
        video.srcObject = null;
      }
    }
  }, [isPrepared, mediaStreamRef, videoRef]);

  return {
    onStart,
    onStop,
    isPrepared,
    isRecording,
    mediaStreamRef,
  };
}
