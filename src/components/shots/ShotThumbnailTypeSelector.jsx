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
      className={
        'relative flex items-center border border-black border-dashed text-gray-400' +
        ' ' +
        className
      }>
      <ImageWithCaption
        src=""
        alt="New shot"
        Icon={null}
        className={
          'flex-1 grid grid-cols-2 grid-rows-2 bg-gray-300 max-w-sm w-[128px] h-[72px]'
        }>
        <button
          className="w-full h-full border-b-2 border-r-2 hover:text-black"
          title="New wide shot"
          onClick={() => onShotTypeClick('WS')}>
          <WideShotIcon className="w-full h-full fill-current" />
        </button>
        <button
          className="w-full h-full border-b-2 border-l-2 hover:text-black"
          title="New medium shot"
          onClick={() => onShotTypeClick('MS')}>
          <MediumShotIcon className="w-full h-full fill-current" />
        </button>
        <button
          className="w-full h-full border-t-2 border-r-2 hover:text-black"
          title="New close-up shot"
          onClick={() => onShotTypeClick('CU')}>
          <CloseUpIcon className="w-full h-full fill-current" />
        </button>
        <button
          className="relative w-full h-full border-t-2 border-l-2 hover:text-black"
          onClick={() => inputCaptureRef.current?.click()}>
          <AddPhotoAlternativeIcon className="w-full h-full fill-current" />
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
