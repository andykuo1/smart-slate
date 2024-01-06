import { useCallback, useEffect, useState } from 'react';

import { useMediaRecorder } from './UseMediaRecorder';
import { tryGetMediaDevices, useMediaStream } from './UseMediaStream';

/**
 * @callback MediaStreamRecorderRecordCallback
 * @param {boolean} recording
 */

/**
 * @callback MediaRecorderCompleteCallback
 * @param {Blob} value
 * @param {MediaRecorder} target
 */

/**
 * @param {MediaStreamRecorderRecordCallback} onRecord
 * @param {MediaRecorderCompleteCallback} onComplete
 */
export function useMediaStreamRecorder(onRecord, onComplete) {
  const [isPrepared, setIsPrepared] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const { mediaStream, mediaStreamRef, initMediaStream, deadMediaStream } =
    useMediaStream();
  const {
    mediaRecorder,
    mediaRecorderRef,
    startMediaRecorder,
    stopMediaRecorder,
  } = useMediaRecorder(mediaStreamRef);

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
    [
      onRecord,
      initMediaStream,
      setIsPrepared,
      startMediaRecorder,
      setIsRecording,
    ],
  );

  const onStop = useCallback(
    /**
     * @param {object} opts
     * @param {boolean} opts.exit
     */
    async function onStop({ exit }) {
      const result = await stopMediaRecorder();
      setIsRecording(false);
      onRecord(false);
      if (exit) {
        await deadMediaStream();
        setIsPrepared(false);
      }
      if (result.value && result.target) {
        onComplete(result.value, result.target);
      }
    },
    [
      onComplete,
      onRecord,
      stopMediaRecorder,
      setIsRecording,
      deadMediaStream,
      setIsPrepared,
    ],
  );

  return {
    onStart,
    onStop,
    isPrepared,
    isRecording,
    mediaStream,
    mediaRecorder,
    mediaStreamRef,
    mediaRecorderRef,
    startMediaRecorder,
    stopMediaRecorder,
    initMediaStream,
    deadMediaStream,
  };
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
