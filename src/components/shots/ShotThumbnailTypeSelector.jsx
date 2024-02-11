import { useCallback, useRef } from 'react';

import AddPhotoAlternativeIcon from '@material-symbols/svg-400/rounded/add_photo_alternate.svg';

import ImageWithCaption from '@/libs/ImageWithCaption';
import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { blobToDataURI } from './options/ShotThumbnailHelper';
import { getShotTypeIcon } from './options/ShotTypeIcon';

const WideShotIcon = getShotTypeIcon('WS');
const MediumShotIcon = getShotTypeIcon('MS');
const CloseUpIcon = getShotTypeIcon('CU');

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function ShotThumbnailTypeSelector({
  className,
  documentId,
  sceneId,
  blockId,
}) {
  const inputCaptureRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  const addShot = useDocumentStore((ctx) => ctx.addShot);
  const setShotReferenceImage = useDocumentStore(
    (ctx) => ctx.setShotReferenceImage,
  );

  /**
   * @param {string} shotType
   */
  function onShotTypeClick(shotType) {
    let newShot = createShot();
    newShot.shotType = shotType;
    addShot(documentId, sceneId, blockId, newShot);
  }

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
    <div
      className={'relative flex items-center text-gray-400' + ' ' + className}>
      <ImageWithCaption
        src=""
        alt="New shot"
        Icon={null}
        className={
          'grid h-[72px] w-[128px] max-w-sm flex-1 grid-cols-2 grid-rows-2'
        }>
        <button
          className="h-full w-full border-b border-r hover:text-black"
          title="New wide shot"
          onClick={() => onShotTypeClick('WS')}>
          <WideShotIcon className="h-full w-full fill-current" />
        </button>
        <button
          className="h-full w-full border-b border-l hover:text-black"
          title="New medium shot"
          onClick={() => onShotTypeClick('MS')}>
          <MediumShotIcon className="h-full w-full fill-current" />
        </button>
        <button
          className="h-full w-full border-r border-t hover:text-black"
          title="New close-up shot"
          onClick={() => onShotTypeClick('CU')}>
          <CloseUpIcon className="h-full w-full fill-current" />
        </button>
        <button
          className="relative h-full w-full border-l border-t hover:text-black"
          onClick={() => inputCaptureRef.current?.click()}>
          <AddPhotoAlternativeIcon className="h-full w-full fill-current" />
        </button>
      </ImageWithCaption>
      <input
        ref={inputCaptureRef}
        className="hidden"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onInputChange}
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
