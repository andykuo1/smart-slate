import { useCallback, useRef } from 'react';

import AddPhotoAlternativeIcon from '@material-symbols/svg-400/rounded/add_photo_alternate.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { useDocumentStore } from '@/stores/document/use';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { blobToDataURI } from '../options/ShotThumbnailHelper';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function SettingsShotReferenceImageField({
  documentId,
  shotId,
}) {
  const inputCaptureRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  const setShotReferenceImage = useDocumentStore(
    (ctx) => ctx.setShotReferenceImage,
  );

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
      ).then((uri) => setShotReferenceImage(documentId, shotId, uri));
    },
    [documentId, shotId, setShotReferenceImage],
  );
  return (
    <>
      <SettingsFieldButton
        className="w-auto"
        Icon={AddPhotoAlternativeIcon}
        onClick={() => inputCaptureRef.current?.click()}
      />
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
