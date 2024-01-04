import { useCallback, useRef, useState } from 'react';

import { downloadURLImpl } from '@/utils/Downloader';
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '@/values/RecorderValues';

import { useRecorderV2 } from './UseRecorderV2';

export function useRecorderContextValue() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const [videoDeviceId, setVideoDeviceId] = useState('');
  const [audioDeviceId, setAudioDeviceId] = useState('');
  const [mediaStreamConstraints, setMediaStreamConstraints] = useState(
    MEDIA_STREAM_CONSTRAINTS,
  );
  const [mediaRecorderOptions, setMediaRecorderOptions] = useState(
    MEDIA_RECORDER_OPTIONS,
  );
  const [mediaBlobOptions, setMediaBlobOptions] = useState(MEDIA_BLOB_OPTIONS);

  /** @type {import('@/recorder/UseMediaRecorder').MediaRecorderCompleteCallback} */
  const onComplete = useCallback(function _onComplete(blob, mediaRecorder) {
    const dataURL = URL.createObjectURL(blob);
    downloadURLImpl('Untitled.mp4', dataURL);
    URL.revokeObjectURL(dataURL);

    const message = `Got ${blob.type}:${blob.size} bytes!`;
    window.alert(message);
  }, []);

  const { onStart, onStop, isPrepared, isRecording, mediaStreamRef } =
    useRecorderV2(videoRef, onComplete);

  return {
    videoRef,
    mediaStreamRef,
    onStart,
    onStop,
    isPrepared,
    isRecording,
    mediaStreamConstraints,
    mediaRecorderOptions,
    mediaBlobOptions,
    videoDeviceId,
    audioDeviceId,
    setMediaBlobOptions,
    setMediaRecorderOptions,
    setMediaStreamConstraints,
    setVideoDeviceId,
    setAudioDeviceId,
  };
}
