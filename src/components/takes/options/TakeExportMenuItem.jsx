import { MenuItem } from '@ariakit/react';
import { useEffect, useState } from 'react';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';
import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';

import { useGAPITokenHandler } from '@/lib/googleapi';
import {
  useTakeDownloader,
  useTakeGoogleDriveUploader,
} from '@/serdes/UseTakeExporter';
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
  const [googleDriveConnected, setGoogleDriveConnected] = useState(false);
  const idbKey = useTakeExportedIDBKey(documentId, takeId);
  const downloadTake = useTakeDownloader();
  const uploadTake = useTakeGoogleDriveUploader();
  const handleToken = useGAPITokenHandler();

  function onDownloadClick() {
    if (!idbKey) {
      return;
    }
    downloadTake(documentId, sceneId, shotId, takeId);
  }

  function onGoogleDriveClick() {
    uploadTake(documentId, sceneId, shotId, takeId);
  }

  useEffect(() => {
    // Test video in cache
    getVideoBlob(takeId)
      .then((result) => {
        if (result) {
          setCached(true);
        } else {
          setCached(false);
        }
      })
      .catch(() => setCached(false));

    // Test google drive connection
    if (!handleToken((token) => setGoogleDriveConnected(Boolean(token)))) {
      setGoogleDriveConnected(false);
    }
  }, [menuOpen]);

  return (
    <div className="flex flex-row">
      <MenuItem
        className={MenuStyle.menuItem + ' ' + 'flex-1 flex flex-row'}
        onClick={onDownloadClick}
        disabled={!cached}>
        <span className="flex-1">Export to</span>
        <DownloadIcon className="w-6 h-6 fill-current" />
      </MenuItem>
      <MenuItem
        className={MenuStyle.menuItem}
        onClick={onGoogleDriveClick}
        disabled={!cached || !googleDriveConnected}>
        <AddToDriveIcon className="w-6 h-6 fill-current" />
      </MenuItem>
    </div>
  );
}
