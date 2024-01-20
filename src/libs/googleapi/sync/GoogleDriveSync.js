import { useDocumentStore } from '@/stores/document/use';

import {
  useDocumentStoreCRUD,
  useGetDocumentStoreConfiguration,
} from './DocumentStoreCRUD';
import {
  GoogleDriveCRUD,
  useGetGoogleDriveConfiguration,
  useGetToken,
  useUpdateGoogleDriveConfiguration,
} from './GoogleDriveCRUD';
import { sync } from './Sync';

export function useGoogleDriveSync() {
  const getToken = useGetToken();
  const getDocumentStoreConfiguration = useGetDocumentStoreConfiguration();
  const getGoogleDriveConfiguration = useGetGoogleDriveConfiguration();
  const updateGoogleDriveConfiguration = useUpdateGoogleDriveConfiguration();
  const documentStoreCRUD = useDocumentStoreCRUD();
  const setDocumentLastExportedMillis = useDocumentStore(
    (ctx) => ctx.setDocumentLastExportedMillis,
  );

  // Syncs to app-data
  async function syncToGoogleDrive() {
    const token = await getToken();
    if (!token) {
      console.log(
        '[GoogleDriveSync] Not connected to Google Drive. Skipping...',
      );
      return;
    }
    console.log('[GoogleDriveSync] Connected to Google Drive. Syncing...');
    const googleDriveCRUD = new GoogleDriveCRUD(token);

    /**
     * @param {import('./Sync').Configuration} config
     * @param {Array<import('./Sync').SyncFile>} changed
     */
    async function updateRemoteConfiguration(config, changed) {
      let now = Date.now();
      for (let file of changed) {
        setDocumentLastExportedMillis(file.key, now);
      }
      await updateGoogleDriveConfiguration(config);
    }

    await sync(
      documentStoreCRUD,
      googleDriveCRUD,
      getDocumentStoreConfiguration,
      getGoogleDriveConfiguration,
      updateRemoteConfiguration,
    );
  }
  return syncToGoogleDrive;
}
