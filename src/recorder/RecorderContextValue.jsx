import { useCallback, useEffect, useRef, useState } from 'react';

import { useTakeExporter } from '@/serdes/UseTakeExporter';
import { useSetUserCursor, useUserStore } from '@/stores/user';

import { useMediaRecorder } from './UseMediaRecorder';
import { tryGetMediaDevices, useMediaStream } from './UseMediaStream';

export function useRecorderContextValue() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const userCursor = useUserStore((ctx) => ctx.cursor);
  const setUserCursor = useSetUserCursor();
  const exportTake = useTakeExporter();

  /** @type {import('@/recorder/UseMediaRecorder').MediaRecorderCompleteCallback} */
  const onComplete = useCallback(
    function _onComplete(blob, mediaRecorder) {
      const { documentId, sceneId, shotId } = userCursor;
      const takeId = exportTake(blob, documentId, sceneId, shotId);
      setUserCursor(documentId, sceneId, shotId, takeId);
    },
    [userCursor, exportTake, setUserCursor],
  );

  const { onStart, onStop, isPrepared, isRecording, mediaStreamRef } =
    useRecorderControls(onComplete);

  useRecorderLiveVideo(videoRef, mediaStreamRef, isPrepared);
  const deviceIds = useRecorderDeviceIds(mediaStreamRef, isPrepared);

  return {
    videoRef,
    mediaStreamRef,
    onStart,
    onStop,
    isPrepared,
    isRecording,
    ...deviceIds,
  };
}

/**
 * @param {import('react').RefObject<MediaStream|null>} mediaStreamRef
 * @param {boolean} isPrepared
 */
function useRecorderDeviceIds(mediaStreamRef, isPrepared) {
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

/**
 * @param {import('./UseMediaRecorder').MediaRecorderCompleteCallback} onComplete
 */
function useRecorderControls(onComplete) {
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

  return {
    onStart,
    onStop,
    isPrepared,
    isRecording,
    mediaStreamRef,
  };
}

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @param {import('react').RefObject<MediaStream|null>} mediaStreamRef
 * @param {boolean} isPrepared
 */
function useRecorderLiveVideo(videoRef, mediaStreamRef, isPrepared) {
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
