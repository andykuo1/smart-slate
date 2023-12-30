import { Button, TabPanel } from '@ariakit/react';
import { useCallback, useRef } from 'react';

import { useSetShotThumbnail } from '@/stores/document';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { blobToDataURI } from './ShotThumbnailHelper';

/**
 * @param {object} props
 * @param {string} props.documentId
 * @param {string} props.shotId
 */
export default function ThumbnailOptionCamera({ documentId, shotId }) {
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
    <TabPanel className="flex flex-col">
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />
      <canvas ref={canvasRef} className="hidden" />
      <Button
        className="border rounded-xl p-2 w-full hover:bg-opacity-10 bg-opacity-0 bg-white"
        onClick={handleClick}>
        Take a photo
      </Button>
      <p className="opacity-30 text-xs text-center mt-4">
        Make it something inspiring :)
      </p>
    </TabPanel>
  );
}
