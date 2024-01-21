import { useShallow } from 'zustand/react/shallow';

import DownloadingIcon from '@material-symbols/svg-400/rounded/downloading.svg';
import PublishedWithChangesIcon from '@material-symbols/svg-400/rounded/published_with_changes.svg';
import SyncIcon from '@material-symbols/svg-400/rounded/sync.svg';
import SyncDisabledIcon from '@material-symbols/svg-400/rounded/sync_disabled.svg';

import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import { useGoogleToken } from '@/libs/googleapi/auth/UseGoogleToken';
import { useGoogleDriveSync } from '@/libs/googleapi/sync/GoogleDriveSync';
import { getDocumentById, getDocumentIds } from '@/stores/document';
import { useActiveDocumentIds, useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function ProjectListStatusButton({ className }) {
  const documentIds = useActiveDocumentIds();
  const syncableDocumentIds = useDocumentStore(
    useShallow((ctx) =>
      getDocumentIds(ctx).filter((documentId) => {
        let document = getDocumentById(ctx, documentId);
        if (document?.lastDeletedMillis <= 0) return false;
        if (document?.settings?.autoSaveTo === 'gdrive') return true;
        return false;
      }),
    ),
  );
  const token = useGoogleToken();
  const { syncStatus, syncToGoogleDrive } = useGoogleDriveSync();
  async function onClick() {
    await syncToGoogleDrive();
  }
  return (
    <button
      className={'group flex flex-row items-center' + ' ' + className}
      onClick={onClick}
      disabled={!token}>
      <span className="mx-2">
        {syncableDocumentIds.length}/{documentIds.length}
      </span>
      <SyncStatusIcon
        className="group-disabled:opacity-30"
        value={syncStatus}
      />
    </button>
  );
}

/**
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {ReturnType<useGoogleDriveSync>['syncStatus']} props.value
 */
function SyncStatusIcon({ className, value }) {
  const googleStatus = useGoogleStatus();
  const iconClassName = 'w-6 h-6 fill-current' + ' ' + className;
  if (!googleStatus) {
    return <SyncDisabledIcon className={iconClassName} />;
  }
  switch (value) {
    case 'offline':
      return <DownloadingIcon className={iconClassName} />;
    case 'online':
      return <PublishedWithChangesIcon className={iconClassName} />;
    case 'syncing':
      return <SyncIcon className={iconClassName} />;
  }
}
