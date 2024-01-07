import { useCallback } from 'react';

import { getTakeById, useDocumentStore } from '@/stores/document';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { useCachedVideoBlob } from '../cache/UseCachedVideoBlob';
import { captureVideoSnapshot } from './VideoSnapshot';

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 * @returns {[boolean, import('react').MouseEventHandler<HTMLButtonElement>]}
 */
export function useVideoSnapshot(videoRef, documentId, takeId) {
  const videoBlob = useCachedVideoBlob(documentId, takeId);
  const takePreviewImage = useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.previewImage,
  );
  const setTakePreviewImage = useDocumentStore(
    (ctx) => ctx.setTakePreviewImage,
  );

  /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
  const click = useCallback(
    function click(e) {
      if (!videoBlob || takePreviewImage) {
        return;
      }
      captureVideoSnapshot(
        videoRef,
        videoBlob,
        0.5,
        MAX_THUMBNAIL_WIDTH,
        MAX_THUMBNAIL_HEIGHT,
      ).then((url) => {
        console.log(
          '[UseVideoSnapshot] Setting take preview to url with length ' +
            url?.length,
        );
        setTakePreviewImage(documentId, takeId, url);
      });
    },
    [videoBlob, takePreviewImage, documentId, takeId, setTakePreviewImage],
  );

  return [Boolean(videoBlob), click];
}
