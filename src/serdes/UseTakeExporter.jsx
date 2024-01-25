import { useCallback } from 'react';

import { uploadFile } from '@/libs/googleapi';
import { useGoogleToken } from '@/libs/googleapi/auth/UseGoogleToken';
import { cacheVideoBlob, getVideoBlob } from '@/recorder/cache/VideoCache';
import {
  useSetTakeExportedGoogleDriveFileId,
  useSetTakeExportedIDBKey,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { getIDBKeyFromTakeId } from '@/stores/document/value';
import { useSettingsStore } from '@/stores/settings';
import { downloadURLImpl } from '@/utils/Downloader';

import { useDefineTake } from './UseDefineTake';
import { useResolveTakeFileName } from './UseResolveTakeFileName';

export function useTakeDownloader() {
  const resolveTakeFileName = useResolveTakeFileName();

  const downloadTake = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     */
    async function _downloadTake(documentId, sceneId, shotId, takeId) {
      const idbKey = getIDBKeyFromTakeId(takeId);
      const data = await getVideoBlob(documentId, idbKey);
      if (!data) {
        return;
      }
      const takeFileName = resolveTakeFileName(
        documentId,
        sceneId,
        shotId,
        takeId,
        data.type,
      );

      // Download it.
      const dataURL = URL.createObjectURL(data);
      downloadURLImpl(takeFileName, dataURL);
      URL.revokeObjectURL(dataURL);
    },
    [resolveTakeFileName],
  );

  return downloadTake;
}

export function useTakeGoogleDriveUploader() {
  const resolveTakeFileName = useResolveTakeFileName();

  const token = useGoogleToken();
  const setTakeExportedGoogleDriveFileId = useDocumentStore(
    (ctx) => ctx.setTakeExportedGoogleDriveFileId,
  );

  const uploadTake = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     */
    async function _uploadTake(documentId, sceneId, shotId, takeId) {
      const idbKey = getIDBKeyFromTakeId(takeId);
      const data = await getVideoBlob(documentId, idbKey);
      if (!data) {
        return;
      }
      const takeFileName = resolveTakeFileName(
        documentId,
        sceneId,
        shotId,
        takeId,
        data.type,
      );

      // Upload it (if online).
      if (!token) {
        return;
      }
      uploadFile(token.access_token, takeFileName, data.type, data)
        .then((fileId) => {
          setTakeExportedGoogleDriveFileId(documentId, takeId, fileId);
          console.log('Upload file - ' + takeFileName);
        })
        .catch(() => {
          console.error('Failed to upload file - ' + takeFileName);
        });
    },
    [token, resolveTakeFileName, setTakeExportedGoogleDriveFileId],
  );

  return uploadTake;
}

export function useTakeExporter() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useResolveTakeFileName();
  const defineTake = useDefineTake();

  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const setTakeExportedGoogleDriveFileId =
    useSetTakeExportedGoogleDriveFileId();
  const setTakeExportedIDBKey = useSetTakeExportedIDBKey();
  const enableDriveSync = useSettingsStore((ctx) => ctx.user.enableDriveSync);
  const token = useGoogleToken();

  const exportTake = useCallback(
    /**
     * @param {Blob} data
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {object} [opts]
     * @param {boolean} [opts.uploadOnly]
     * @param {import('@/stores/document/DocumentStore').TakeId} [opts.targetTakeId]
     * @returns {import('@/stores/document/DocumentStore').TakeId}
     */
    function exportTake(data, documentId, sceneId, shotId, opts = {}) {
      const take = defineTake(documentId, sceneId, shotId, {
        ...opts,
        dataType: data.type,
        dataSize: data.size,
      });
      const takeId = take.takeId;
      // NOTE: This should always be defined by defineTake(), but just in-case...
      const takeFileName = take.exportDetails.fileName ?? takeId;

      // Always cache it-- just in case.
      cacheVideoBlob(documentId, takeId, data).then((key) =>
        setTakeExportedIDBKey(documentId, takeId, key),
      );

      if (token && enableDriveSync) {
        // Upload it.
        uploadFile(token.access_token, takeFileName, data.type, data)
          .then((fileId) => {
            setTakeExportedGoogleDriveFileId(documentId, takeId, fileId);
            console.log('Upload file - ' + takeFileName);
          })
          .catch(() => {
            console.error('Failed to upload file - ' + takeFileName);
          });
      }
      return takeId;
    },
    [
      token,
      enableDriveSync,
      UNSAFE_getStore,
      addTake,
      resolveTakeFileName,
      setTakeExportedGoogleDriveFileId,
      setTakeExportedIDBKey,
    ],
  );

  return exportTake;
}
