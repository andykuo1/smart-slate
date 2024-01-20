import { createContext, useCallback, useContext, useState } from 'react';

import { useDocumentStore } from '@/stores/document/use';

import { useGoogleToken } from '../auth/UseGoogleToken';
import {
  useDocumentStoreCRUD,
  useGetDocumentStoreConfiguration,
} from './DocumentStoreCRUD';
import {
  GoogleDriveCRUD,
  useGetGoogleDriveConfiguration,
  useUpdateGoogleDriveConfiguration,
} from './GoogleDriveCRUD';
import { sync } from './Sync';

export const GoogleDriveSyncContext = createContext(
  /** @type {ReturnType<useGoogleDriveSyncImpl>|null} */ (null),
);

export function useGoogleDriveSync() {
  let result = useContext(GoogleDriveSyncContext);
  if (!result) {
    throw new Error('Missing provider.');
  }
  return result;
}

export function useGoogleDriveSyncImpl() {
  const [syncStatus, setSyncStatus] = useState(
    /** @type {'offline'|'online'|'syncing'} */ ('offline'),
  );
  const token = useGoogleToken();
  const getDocumentStoreConfiguration = useGetDocumentStoreConfiguration();
  const getGoogleDriveConfiguration = useGetGoogleDriveConfiguration();
  const updateGoogleDriveConfiguration = useUpdateGoogleDriveConfiguration();
  const documentStoreCRUD = useDocumentStoreCRUD();
  const setDocumentLastExportedMillis = useDocumentStore(
    (ctx) => ctx.setDocumentLastExportedMillis,
  );
  const setDocumentLastDataExportedMillis = useDocumentStore(
    (ctx) => ctx.setDocumentLastDataExportedMillis,
  );

  // Syncs to app-data
  const syncToGoogleDrive = useCallback(
    async function _syncToGoogleDrive() {
      if (!token) {
        console.log(
          '[GoogleDriveSync] Not connected to Google Drive. Skipping...',
        );
        setSyncStatus('offline');
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
          // TODO: In the future, this should only be set when we also move data.
          setDocumentLastDataExportedMillis(file.key, now);
        }
        await updateGoogleDriveConfiguration(config);
      }

      try {
        setSyncStatus('syncing');
        await sync(
          documentStoreCRUD,
          googleDriveCRUD,
          getDocumentStoreConfiguration,
          getGoogleDriveConfiguration,
          updateRemoteConfiguration,
        );
        setSyncStatus('online');
      } catch (e) {
        const { name, message } = /** @type {Error} */ (e);
        console.error('[GoogleDriveSync] Failed to sync - ', name, message);
        setSyncStatus('offline');
      }
    },
    [
      token,
      documentStoreCRUD,
      getDocumentStoreConfiguration,
      getGoogleDriveConfiguration,
      setDocumentLastExportedMillis,
      setDocumentLastDataExportedMillis,
      updateGoogleDriveConfiguration,
    ],
  );

  return {
    syncToGoogleDrive,
    syncStatus,
  };
}
