import { useCallback, useRef } from 'react';

import { useTakeExporter } from '@/serdes/UseTakeExporter';
import { useSetTakePreviewImage } from '@/stores/document';
import { useSetUserCursor, useUserStore } from '@/stores/user';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import {
  useMediaStreamRecorder,
  useMediaStreamRecorderDevices,
  useMediaStreamRecorderLiveVideo,
  useMediaStreamRecorderLiveVideoSnapshot,
} from './UseMediaStreamRecorder';

export function useRecorderContextValue() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const userCursor = useUserStore((ctx) => ctx.cursor);
  const setUserCursor = useSetUserCursor();
  const setTakePreviewImage = useSetTakePreviewImage();
  const exportTake = useTakeExporter();
  const snapshotControls = useMediaStreamRecorderLiveVideoSnapshot(videoRef);
  const { setVideoSnapshotURL, takeVideoSnapshot } = snapshotControls;

  // TODO: Ideally, this is just passed in when we call onStart or something.
  /** @type {import('@/recorder/UseMediaStreamRecorder').MediaRecorderCompleteCallback} */
  const onComplete = useCallback(
    function _onComplete(blob, mediaRecorder) {
      const { documentId, sceneId, shotId } = userCursor;
      const takeId = exportTake(blob, documentId, sceneId, shotId);
      setVideoSnapshotURL((prev) => {
        if (prev) {
          setTakePreviewImage(documentId, takeId, prev);
        }
        // Reset preview image :)
        return '';
      });
      setUserCursor(documentId, sceneId, shotId, takeId);
    },
    [userCursor, exportTake, setUserCursor, setVideoSnapshotURL],
  );

  /** @type {import('@/recorder/UseMediaStreamRecorder').MediaStreamRecorderRecordCallback} */
  const onRecord = useCallback(
    function _onRecord(recording) {
      if (recording) {
        takeVideoSnapshot(MAX_THUMBNAIL_WIDTH, MAX_THUMBNAIL_HEIGHT);
      }
    },
    [takeVideoSnapshot],
  );

  const recorderControls = useMediaStreamRecorder(onRecord, onComplete);
  const { isPrepared, mediaStreamRef } = recorderControls;
  const deviceIds = useMediaStreamRecorderDevices(mediaStreamRef, isPrepared);
  useMediaStreamRecorderLiveVideo(videoRef, mediaStreamRef, isPrepared);

  return {
    videoRef,
    ...recorderControls,
    ...deviceIds,
    ...snapshotControls,
  };
}
