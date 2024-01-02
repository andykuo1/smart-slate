import { useCallback, useRef, useState } from 'react';

import { useTakeExporter } from '@/serdes/UseTakeExporter';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '@/values/RecorderValues';

import { useRecorderV2 } from './UseRecorderV2';

export function useMediaRecorderContextValue() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const [mediaStreamConstraints, setMediaStreamConstraints] = useState(
    MEDIA_STREAM_CONSTRAINTS,
  );
  const [mediaRecorderOptions, setMediaRecorderOptions] = useState(
    MEDIA_RECORDER_OPTIONS,
  );
  const [mediaBlobOptions, setMediaBlobOptions] = useState(MEDIA_BLOB_OPTIONS);

  const exportTake = useTakeExporter();
  const userCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();

  /** @type {import('@/recorder/UseMediaRecorder').MediaRecorderCompleteCallback} */
  const onComplete = useCallback(
    function _onComplete(blob, mediaRecorder) {
      const { documentId, sceneId, shotId } = userCursor;
      const takeId = exportTake(blob, documentId, sceneId, shotId);
      setUserCursor(documentId, sceneId, shotId, takeId);
    },
    [userCursor, exportTake, setUserCursor],
  );

  const { onStart, onStop, isPrepared, isRecording } = useRecorderV2(
    videoRef,
    onComplete,
  );

  return {
    videoRef,
    onStart,
    onStop,
    isPrepared,
    isRecording,
    mediaStreamConstraints,
    mediaRecorderOptions,
    mediaBlobOptions,
    setMediaBlobOptions,
    setMediaRecorderOptions,
    setMediaStreamConstraints,
  };
}
