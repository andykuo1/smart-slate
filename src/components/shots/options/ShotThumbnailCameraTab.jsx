import { Tab } from '@ariakit/react';
import { useCallback, useRef } from 'react';

import PhotoCameraIcon from '@material-symbols/svg-400/rounded/photo_camera.svg';

import { useSetShotThumbnail } from '@/stores/document';
import TabStyle from '@/styles/Tab.module.css';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { blobToDataURI } from './ShotThumbnailHelper';

/**
 * @param {object} props
 * @param {string} props.documentId
 * @param {string} props.shotId
 * @param {boolean} [props.disabled]
 */
export default function ShotThumbnailCameraTab({
  documentId,
  shotId,
  disabled = false,
}) {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  const setShotThumbnail = useSetShotThumbnail();

  const handleClick = useCallback(function _handleClick() {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function _handleChange(e) {
      const el = /** @type {HTMLInputElement} */ (e.target);
      const file = el.files?.[0];
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
      ).then((uri) => setShotThumbnail(documentId, shotId, uri));
    },
    [documentId, shotId, setShotThumbnail],
  );

  return (
    <Tab
      className={TabStyle.tab + ' ' + 'flex-1'}
      disabled={disabled}
      onClick={handleClick}>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />
      <canvas ref={canvasRef} className="hidden" />
      <PhotoCameraIcon className="w-6 h-6 fill-current" />
    </Tab>
  );
}
