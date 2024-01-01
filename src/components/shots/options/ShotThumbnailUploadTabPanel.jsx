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
export default function ShotThumbnailUploadTabPanel({ documentId, shotId }) {
  const setShotThumbnail = useSetShotThumbnail();
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));

  const handleClick = useCallback(function _handleClick() {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    function _handleChange() {
      const input = inputRef.current;
      if (!input) {
        return;
      }
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      input.value = '';
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
      <Button
        className="border rounded-xl p-2 w-full hover:bg-opacity-10 bg-opacity-0 bg-white"
        onClick={handleClick}>
        Upload file
      </Button>
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <p className="opacity-30 text-xs text-center mt-4">
        Please keep image size small :)
      </p>
    </TabPanel>
  );
}
