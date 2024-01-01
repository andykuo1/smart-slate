import { Button, TabPanel } from '@ariakit/react';
import { useCallback, useRef } from 'react';

import { useSetShotThumbnail } from '@/stores/document';

/**
 * @param {object} props
 * @param {string} props.documentId
 * @param {string} props.shotId
 */
export default function ShotThumbnailEmbedTabPanel({ documentId, shotId }) {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const setShotThumbnail = useSetShotThumbnail();

  const handleClick = useCallback(
    function _handleClick() {
      const input = inputRef.current;
      if (!input) {
        return;
      }
      const url = input.value;
      input.value = '';
      setShotThumbnail(documentId, shotId, url);
    },
    [documentId, shotId, setShotThumbnail],
  );

  return (
    <TabPanel className="flex flex-col">
      <input
        ref={inputRef}
        className="mb-4 p-1 rounded"
        type="url"
        placeholder="Paste image link..."
      />
      <Button
        className="border rounded-xl p-2 w-full hover:bg-opacity-10 bg-opacity-0 bg-white"
        onClick={handleClick}>
        Embed image
      </Button>
      <p className="opacity-30 text-xs text-center mt-4">
        Works with any image from the web
      </p>
    </TabPanel>
  );
}
