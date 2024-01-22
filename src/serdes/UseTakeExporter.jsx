import { useCallback } from 'react';

import { formatTakeNameForFileExport } from '@/components/takes/TakeNameFormat';
import { uploadFile } from '@/libs/googleapi';
import { useGoogleToken } from '@/libs/googleapi/auth/UseGoogleToken';
import { cacheVideoBlob, getVideoBlob } from '@/recorder/cache/VideoCache';
import {
  getSceneNumber,
  getShotNumber,
  getTakeNumber,
  useSetTakeExportedGoogleDriveFileId,
  useSetTakeExportedIDBKey,
} from '@/stores/document';
import { getDocumentById, getShotById } from '@/stores/document';
import { createTake } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import { getIDBKeyFromTakeId } from '@/stores/document/value';
import { useSettingsStore } from '@/stores/settings';
import { downloadURLImpl } from '@/utils/Downloader';

import { useResolveTakeFileName } from './UseResolveTakeFileName';
import { useResolveTakeShotHash } from './UseResolveTakeShotHash';

export function useTakeDownloader() {
  const resolveTakeFileName = useResolveTakeFileName();
  const resolveTakeShotHash = useResolveTakeShotHash();

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

      const shotHash = resolveTakeShotHash(documentId, shotId);
      const takeFileName = resolveTakeFileName(
        documentId,
        sceneId,
        shotId,
        takeId,
        shotHash,
        data.type,
      );

      // Download it.
      const dataURL = URL.createObjectURL(data);
      downloadURLImpl(takeFileName, dataURL);
      URL.revokeObjectURL(dataURL);
    },
    [resolveTakeShotHash, resolveTakeFileName],
  );

  return downloadTake;
}

export function useTakeGoogleDriveUploader() {
  const resolveTakeFileName = useResolveTakeFileName();
  const resolveTakeShotHash = useResolveTakeShotHash();

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

      const shotHash = resolveTakeShotHash(documentId, shotId);
      const takeFileName = resolveTakeFileName(
        documentId,
        sceneId,
        shotId,
        takeId,
        shotHash,
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
    [
      token,
      resolveTakeShotHash,
      resolveTakeFileName,
      setTakeExportedGoogleDriveFileId,
    ],
  );

  return uploadTake;
}

export function useTakeExporter() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useResolveTakeFileName();
  const resolveTakeShotHash = useResolveTakeShotHash();

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
      const store = UNSAFE_getStore();
      const takeShotHash = resolveTakeShotHash(documentId, shotId);
      const takeFileName = resolveTakeFileName(
        documentId,
        sceneId,
        shotId,
        '',
        takeShotHash,
        data.type,
      );

      const shot = getShotById(store, documentId, shotId);
      let newTake = createTake();
      newTake.exportDetails.fileName = takeFileName;
      newTake.exportDetails.timestampMillis = Date.now();
      newTake.exportDetails.shotType = shot?.shotType;
      newTake.exportDetails.sizeBytes = data.size;
      if (opts?.targetTakeId) {
        newTake.takeId = opts.targetTakeId;
      }
      addTake(documentId, shotId, newTake);
      const takeId = newTake.takeId;

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
      resolveTakeShotHash,
      resolveTakeFileName,
      setTakeExportedGoogleDriveFileId,
      setTakeExportedIDBKey,
    ],
  );

  return exportTake;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 * @param {import('@/stores/document/DocumentStore').ShotHash} shotHash
 */
export function getNextAvailableTakeNameForFileExport(
  store,
  documentId,
  sceneId,
  shotId,
  takeId,
  shotHash,
) {
  const document = getDocumentById(store, documentId);
  const projectId =
    document?.settings?.projectId || document?.documentTitle || 'Untitled';
  const shot = getShotById(store, documentId, shotId);
  const sceneNumber = getSceneNumber(store, documentId, sceneId);
  const shotNumber = getShotNumber(store, documentId, sceneId, shotId);
  const takeNumber = takeId
    ? getTakeNumber(store, documentId, shotId, takeId)
    : shot?.takeIds?.length + 1;
  const shotType = shot?.shotType;

  const takeName = formatTakeNameForFileExport(
    projectId,
    sceneNumber,
    shotNumber,
    takeNumber,
    shotHash,
    shotType,
  );
  return takeName;
}
