import { MenuItem } from '@ariakit/react';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';
import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';

import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import { useCachedVideoBlob } from '@/recorder/cache';
import {
  useTakeDownloader,
  useTakeGoogleDriveUploader,
} from '@/serdes/UseTakeExporter';
import { getTakeExportDetailsById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
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
  const idbKey = useDocumentStore(
    (ctx) => getTakeExportDetailsById(ctx, documentId, takeId)?.idbKey,
  );
  const googleStatus = useGoogleStatus();
  const downloadTake = useTakeDownloader();
  const uploadTake = useTakeGoogleDriveUploader();

  function onDownloadClick() {
    if (!idbKey || !videoBlob) {
      return;
    }
    downloadTake(documentId, sceneId, shotId, takeId).catch((e) =>
      console.error('[TakeExportMenuItem] Error! ' + e.message),
    );
  }

  function onGoogleDriveClick() {
    if (!videoBlob) {
      return;
    }
    uploadTake(documentId, sceneId, shotId, takeId);
  }

  return (
    <div className="flex flex-row">
      <MenuItem
        className={MenuStyle.menuItem + ' ' + 'flex-1 flex flex-row'}
        onClick={onDownloadClick}
        disabled={!idbKey || !videoBlob}>
        <span className="flex-1">Export to</span>
        <DownloadIcon className="w-6 h-6 fill-current" />
      </MenuItem>
      <MenuItem
        className={MenuStyle.menuItem}
        onClick={onGoogleDriveClick}
        disabled={!videoBlob || !googleStatus}>
        <AddToDriveIcon className="w-6 h-6 fill-current" />
      </MenuItem>
    </div>
  );
}
