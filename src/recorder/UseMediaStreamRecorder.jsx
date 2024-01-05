import { useCallback, useEffect, useState } from 'react';

import { useMediaRecorder } from './UseMediaRecorder';
import { tryGetMediaDevices, useMediaStream } from './UseMediaStream';
import { drawElementToCanvasWithRespectToAspectRatio } from './snapshot/VideoSnapshot';

/**
 * @callback MediaStreamRecorderRecordCallback
 * @param {boolean} recording
 */

/**
 * @param {MediaStreamRecorderRecordCallback} onRecord
 * @param {import('./UseMediaRecorder').MediaRecorderCompleteCallback} onComplete
 */
export function useMediaStreamRecorder(onRecord, onComplete) {
  const [isPrepared, setIsPrepared] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const { mediaStreamRef, initMediaStream, deadMediaStream } = useMediaStream();
  const { mediaRecorderRef, startMediaRecorder, stopMediaRecorder } =
    useMediaRecorder(mediaStreamRef, onComplete);

  const onStart = useCallback(
    /**
     * @param {object} opts
     * @param {boolean} opts.record
     * @param {boolean} [opts.restart]
     * @param {MediaStreamConstraints|Array<MediaStreamConstraints>} [opts.mediaStreamConstraints]
     * @param {MediaRecorderOptions} [opts.mediaRecorderOptions]
     */
    async function onStart({
      record,
      restart,
      mediaStreamConstraints,
      mediaRecorderOptions,
    }) {
      await initMediaStream(mediaStreamConstraints, restart);
      setIsPrepared(true);
      if (record) {
        await startMediaRecorder(mediaRecorderOptions);
        setIsRecording(true);
        onRecord(true);
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
      onRecord(false);
      if (exit) {
        await deadMediaStream();
        setIsPrepared(false);
      }
    },
    [stopMediaRecorder, setIsRecording, deadMediaStream, setIsPrepared],
  );

  return {
    onStart,
    onStop,
    isPrepared,
    isRecording,
    mediaStreamRef,
    mediaRecorderRef,
  };
}

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @param {import('react').RefObject<MediaStream|null>} mediaStreamRef
 * @param {boolean} isPrepared
 */
export function useMediaStreamRecorderLiveVideo(
  videoRef,
  mediaStreamRef,
  isPrepared,
) {
  useEffect(() => {
    if (!mediaStreamRef.current) {
      return;
    }
    if (isPrepared) {
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
}

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 */
export function useMediaStreamRecorderLiveVideoSnapshot(videoRef) {
  const [videoSnapshotURL, setVideoSnapshotURL] = useState('');
  const takeVideoSnapshot = useCallback(
    /**
     * @param {number} width
     * @param {number} height
     */
    function takeVideoSnapshot(width, height) {
      if (!videoRef.current) {
        return;
      }
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      drawElementToCanvasWithRespectToAspectRatio(
        canvas,
        video,
        video.videoWidth || video.width,
        video.videoHeight || video.height,
        width,
        height,
      );
      let result = canvas.toDataURL('image/png', 0.5);
      setVideoSnapshotURL(result);
    },
    [videoRef, setVideoSnapshotURL],
  );
  return { videoSnapshotURL, setVideoSnapshotURL, takeVideoSnapshot };
}

/**
 * @param {import('react').RefObject<MediaStream|null>} mediaStreamRef
 * @param {boolean} isPrepared
 */
export function useMediaStreamRecorderDevices(mediaStreamRef, isPrepared) {
  const [videoDeviceId, setVideoDeviceId] = useState('');
  const [audioDeviceId, setAudioDeviceId] = useState('');

  const onDeviceChange = useCallback(
    /** @type {import('react').EventHandler<any>} */
    function _onDeviceChange(e) {
      if (!mediaStreamRef.current) {
        return;
      }
      const mediaStream = mediaStreamRef.current;
      const currentVideoDeviceId =
        mediaStream.getVideoTracks()[0]?.getSettings()?.deviceId || '';
      const currentAudioDeviceId =
        mediaStream.getAudioTracks()[0]?.getSettings()?.deviceId || '';
      if (videoDeviceId !== currentVideoDeviceId) {
        setVideoDeviceId(currentVideoDeviceId);
      }
      if (audioDeviceId !== currentAudioDeviceId) {
        setAudioDeviceId(currentAudioDeviceId);
      }
    },
    [
      videoDeviceId,
      audioDeviceId,
      isPrepared,
      mediaStreamRef,
      setVideoDeviceId,
      setAudioDeviceId,
    ],
  );

  useEffect(() => {
    const mediaDevices = tryGetMediaDevices();
    mediaDevices.addEventListener('devicechange', onDeviceChange);
    return () => {
      mediaDevices.removeEventListener('devicechange', onDeviceChange);
    };
  }, [onDeviceChange]);

  return {
    videoDeviceId,
    audioDeviceId,
    setVideoDeviceId,
    setAudioDeviceId,
  };
}
