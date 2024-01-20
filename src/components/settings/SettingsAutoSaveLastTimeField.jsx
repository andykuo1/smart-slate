import { useEffect, useState } from 'react';

import SyncIcon from '@material-symbols/svg-400/rounded/sync.svg';

import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import { useGoogleDriveSync } from '@/libs/googleapi/sync/GoogleDriveSync';
import { getDocumentById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function SettingsAutoSaveLastTimeField({ className }) {
  const [firstAutoSync, setFirstAutoSync] = useState(true);
  const documentId = useCurrentDocumentId();
  const lastExportedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastExportedMillis,
  );
  const googleStatus = useGoogleStatus();
  const { syncStatus, syncToGoogleDrive } = useGoogleDriveSync();
  const disabled = !googleStatus || syncStatus === 'syncing';

  async function onClick() {
    await syncToGoogleDrive();
  }

  useEffect(() => {
    if (disabled) {
      return;
    }
    // Possibly try an auto-sync?
    if (firstAutoSync) {
      setFirstAutoSync(false);
      syncToGoogleDrive();
    }
  }, [disabled, firstAutoSync, setFirstAutoSync, syncToGoogleDrive]);
  const date = new Date(lastExportedMillis);
  return (
    <output className={'block text-xs text-gray-600' + ' ' + className}>
      {lastExportedMillis <= 0 ? (
        <span>Saved locally on device :)</span>
      ) : (
        <button
          className="flex flex-row items-center disabled:opacity-30"
          onClick={onClick}
          disabled={disabled}>
          {syncStatus === 'syncing' ? (
            'Syncing...'
          ) : (
            <>
              Last synced on {date.toLocaleString()}
              {!disabled && <SyncIcon className="mx-1 w-4 h-4 fill-current" />}
            </>
          )}
        </button>
      )}
    </output>
  );
}
