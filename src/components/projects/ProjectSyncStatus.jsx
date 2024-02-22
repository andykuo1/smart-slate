import AutoDeleteIcon from '@material-symbols/svg-400/rounded/auto_delete.svg';
import CloudDoneIcon from '@material-symbols/svg-400/rounded/cloud_done.svg';
import CloudSyncIcon from '@material-symbols/svg-400/rounded/cloud_sync.svg';
import DownloadingIcon from '@material-symbols/svg-400/rounded/downloading.svg';
import FileOpenIcon from '@material-symbols/svg-400/rounded/file_open.svg';
import OfflineBoltIcon from '@material-symbols/svg-400/rounded/offline_bolt.svg';
import SyncDisabledIcon from '@material-symbols/svg-400/rounded/sync_disabled.svg';
import SyncProblemIcon from '@material-symbols/svg-400/rounded/sync_problem.svg';
import UnknownDocumentIcon from '@material-symbols/svg-400/rounded/unknown_document.svg';
import UploadIcon from '@material-symbols/svg-400/rounded/upload_file.svg';

import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import { getDocumentById, getDocumentSettingsById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function ProjectSyncStatus({ className, documentId }) {
  const autoSaveTo = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.autoSaveTo,
  );
  const lastDeletedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastDeletedMillis,
  );
  const lastUpdatedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastUpdatedMillis,
  );
  const lastExportedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastExportedMillis,
  );
  const lastDataExportedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastDataExportedMillis,
  );
  const hasLocalChanges = lastUpdatedMillis > lastExportedMillis;
  const googleStatus = useGoogleStatus();
  const iconClassName = 'w-6 h-6 fill-current' + ' ' + className;
  if (lastDeletedMillis > 0) {
    return <AutoDeleteIcon className={iconClassName} />;
  }
  // return <PendingIcon className={iconClassName} />; // When loading?
  // return <UnpublishedIcon className={iconClassName} />; // When removed loading
  // return <OfflinePinIcon className={iconClassName} />; // Check mark with circle

  switch (autoSaveTo) {
    case '':
    case 'local':
      if (lastExportedMillis > 0) {
        // This was once exported, but sync has been turned off.
        return <SyncDisabledIcon className={iconClassName} />;
      } else if (googleStatus) {
        // Connected! And will sync if opened.
        return <UploadIcon className={iconClassName} />;
      }
      return <FileOpenIcon className={iconClassName} />;
    case 'gdrive':
      if (!googleStatus) {
        // Not connected!
        return <OfflineBoltIcon className={iconClassName} />;
      }
      if (lastDataExportedMillis < lastExportedMillis) {
        // Data wasn't downloaded-- just metadata.
        // ...and it won't until the user opens it.
        return <DownloadingIcon className={iconClassName} />;
      }
      if (!hasLocalChanges) {
        // No local changes. Should be synced :)
        return <CloudDoneIcon className={iconClassName} />;
      } else {
        // There needs to be a sync soon!
        return <CloudSyncIcon className={iconClassName} />;
      }
    default:
      // For any other kind of auto-save (since they are unknown at the moment).
      if (hasLocalChanges) {
        return <SyncProblemIcon className={iconClassName} />;
      } else {
        return <UnknownDocumentIcon className={iconClassName} />;
      }
  }
}
