import { useCallback, useRef } from 'react';

import { useInterval } from '@/libs/UseInterval';
import {
  uploadFile,
  uploadFileByFileId,
  useGAPITokenHandler,
} from '@/libs/googleapi';
import { getDocumentById, getDocumentSettingsById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

import { formatExportName } from './ExportNameFormat';

export function useProjectAutoSave() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const documentId = useCurrentDocumentId();
  const autoSaveTo = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.autoSaveTo,
  );
  const autoSaveGDriveFielId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.autoSaveGDriveFileId,
  );
  const setDocumentSettingsAutoSaveGDriveFileId = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsAutoSaveGDriveFileId,
  );
  const lastSavedRef = useRef(0);
  const handleToken = useGAPITokenHandler();
  const onInterval = useCallback(
    function _onInterval() {
      console.log('[useProjectAutoSave] Auto-saving to ', autoSaveTo);
      if (autoSaveTo === 'local') {
        // NOTE: It's already saved to localStorage. Just skip it.
        return;
      } else if (autoSaveTo === 'gdrive') {
        // Upload it.
        handleToken((token) => {
          console.log('[useProjectAutoSave] Google drive token available!');
          const store = UNSAFE_getStore();
          const document = getDocumentById(store, documentId);
          const fileName = formatExportName(
            store,
            documentId,
            'EAGLESLATE',
            'PROJECT',
            'json',
          );
          if (
            lastSavedRef.current === document.lastUpdatedMillis &&
            Math.abs(Date.now() - lastSavedRef.current) < 60_000
          ) {
            // Saved rather frequently, so let's skip this one.
            console.log(
              '[useProjectAutoSave] Skipping auto-save cause no change.',
            );
            return;
          }

          if (autoSaveGDriveFielId) {
            uploadFileByFileId(
              token.access_token,
              autoSaveGDriveFielId,
              fileName,
              'application/json',
              JSON.stringify(document),
            )
              .then((fileId) => {
                setDocumentSettingsAutoSaveGDriveFileId(documentId, fileId);
                console.log(
                  'Upload file - ' + fileName + ' with id - ' + fileId,
                );
                const store = UNSAFE_getStore();
                const document = getDocumentById(store, documentId);
                lastSavedRef.current = document.lastUpdatedMillis;
              })
              .catch((e) => {
                console.error('Failed to upload file - ' + fileName, e);
              });
          } else {
            uploadFile(
              token.access_token,
              fileName,
              'application/json',
              JSON.stringify(document),
            )
              .then((fileId) => {
                setDocumentSettingsAutoSaveGDriveFileId(documentId, fileId);
                console.log(
                  'Upload file - ' + fileName + ' with id - ' + fileId,
                );
              })
              .catch((e) => {
                console.error('Failed to upload file - ' + fileName, e);
              });
          }
        });
      } else if (autoSaveTo) {
        throw new Error(`Unsupported auto save for ${autoSaveTo}.`);
      } else {
        // Do nothing.
      }
    },
    [
      autoSaveTo,
      autoSaveGDriveFielId,
      documentId,
      UNSAFE_getStore,
      handleToken,
      setDocumentSettingsAutoSaveGDriveFileId,
    ],
  );
  useInterval(onInterval, 10_000);
}
