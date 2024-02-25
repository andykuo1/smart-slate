import { useCallback, useRef } from 'react';

import { blobToDataURI } from '@/components/shots/options/ShotThumbnailHelper';
import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @returns {[() => import('react').ReactNode, import('react').MouseEventHandler<any>]}
 */
export function useAddShotWithReference(documentId, sceneId, blockId) {
  const inputCaptureRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  const setShotReferenceImage = useDocumentStore(
    (ctx) => ctx.setShotReferenceImage,
  );
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  const onInputChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function _onInputChange(e) {
      const el = /** @type {HTMLInputElement} */ (e.target);
      const file = el?.files?.[0];
      if (!file) {
        return;
      }
      el.value = '';

      // Upload the take.
      blobToDataURI(
        file,
        MAX_THUMBNAIL_WIDTH,
        MAX_THUMBNAIL_HEIGHT,
        canvasRef,
      ).then((uri) => {
        let newShot = createShot();
        addShot(documentId, sceneId, blockId, newShot);
        setShotReferenceImage(documentId, newShot.shotId, uri);
      });
    },
    [documentId, sceneId, blockId, addShot, setShotReferenceImage],
  );

  const render = useCallback(
    function _render() {
      return (
        <>
          <input
            ref={inputCaptureRef}
            className="hidden"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onInputChange}
          />
          <canvas ref={canvasRef} className="hidden" />
        </>
      );
    },
    [inputCaptureRef, canvasRef, onInputChange],
  );

  const click = useCallback(
    function _click() {
      return inputCaptureRef.current?.click?.();
    },
    [inputCaptureRef],
  );

  return [render, click];
}
