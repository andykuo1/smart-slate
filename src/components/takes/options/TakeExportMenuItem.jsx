import { MenuItem } from '@ariakit/react';
import { useEffect, useState } from 'react';

import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';

import { useTakeDownloader } from '@/serdes/UseTakeExporter';
import { useTakeExportedIDBKey } from '@/stores/DocumentStoreContext';
import { getVideoBlob } from '@/stores/VideoCache';
import MenuStyle from '@/styles/Menu.module.css';

import { useForceRefreshOnMenuOpen } from './MenuItemHelper';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 */
export default function TakeCacheMenuItem({
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  // NOTE: It is important that cache checks are done sparingly (only when needed)
  const menuOpen = useForceRefreshOnMenuOpen();

  const [cached, setCached] = useState(false);
  const idbKey = useTakeExportedIDBKey(documentId, takeId);
  const downloadTake = useTakeDownloader();

  function onDownloadClick() {
    if (!idbKey) {
      return;
    }
    downloadTake(documentId, sceneId, shotId, takeId);
  }

  useEffect(() => {
    getVideoBlob(takeId)
      .then((result) => {
        if (result) {
          setCached(true);
        } else {
          setCached(false);
        }
      })
      .catch(() => setCached(false));
  }, [menuOpen]);

  return (
    <MenuItem
      className={MenuStyle.menuItem}
      onClick={onDownloadClick}
      disabled={!cached}>
      <DownloadIcon className="w-6 h-6 fill-current" /> Download
    </MenuItem>
  );
}
