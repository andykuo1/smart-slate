import { useCallback, useRef } from 'react';

import AddPhotoAlternativeIcon from '@material-symbols/svg-400/rounded/add_photo_alternate.svg';

import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { blobToDataURI } from '../options/ShotThumbnailHelper';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {string} props.title
 */
export default function ShotListAddWithReferenceButton({
  className,
  documentId,
  sceneId,
  blockId,
  title,
}) {
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

  return (
    <>
      <button
        className={'h-full w-full' + ' ' + className}
        title={title}
        onClick={() => inputCaptureRef.current?.click()}>
        <AddPhotoAlternativeIcon className="h-full w-full fill-current" />
      </button>
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
}
