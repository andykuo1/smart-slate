import { MenuItem } from '@ariakit/react';
import { useEffect, useState } from 'react';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';
import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';

import { useGAPITokenHandler } from '@/lib/googleapi';
import { useCachedVideoBlob } from '@/recorder/cache';
import {
  useTakeDownloader,
  useTakeGoogleDriveUploader,
} from '@/serdes/UseTakeExporter';
import { useTakeExportedIDBKey } from '@/stores/document';
import MenuStyle from '@/styles/Menu.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 */
export default function TakeCacheMenuItem({
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  const videoBlob = useCachedVideoBlob(documentId, takeId);

  const [googleDriveConnected, setGoogleDriveConnected] = useState(false);
  const idbKey = useTakeExportedIDBKey(documentId, takeId);
  const downloadTake = useTakeDownloader();
  const uploadTake = useTakeGoogleDriveUploader();
  const handleToken = useGAPITokenHandler();

  function onDownloadClick() {
    if (!idbKey || !videoBlob) {
      return;
    }
    downloadTake(documentId, sceneId, shotId, takeId);
  }

  function onGoogleDriveClick() {
    if (!videoBlob) {
      return;
    }
    uploadTake(documentId, sceneId, shotId, takeId);
  }

  useEffect(() => {
    // Test google drive connection
    if (!handleToken((token) => setGoogleDriveConnected(Boolean(token)))) {
      setGoogleDriveConnected(false);
    }
  }, [handleToken, takeId]);

  return (
    <div className="flex flex-row">
      <MenuItem
        className={MenuStyle.menuItem + ' ' + 'flex-1 flex flex-row'}
        onClick={onDownloadClick}
        disabled={!videoBlob}>
        <span className="flex-1">Export to</span>
        <DownloadIcon className="w-6 h-6 fill-current" />
      </MenuItem>
      <MenuItem
        className={MenuStyle.menuItem}
        onClick={onGoogleDriveClick}
        disabled={!videoBlob || !googleDriveConnected}>
        <AddToDriveIcon className="w-6 h-6 fill-current" />
      </MenuItem>
    </div>
  );
}
