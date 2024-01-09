import { useCallback } from 'react';

import { formatTakeNameForFileExport } from '@/components/takes/TakeNameFormat';
import { uploadFile, useGAPITokenHandler } from '@/libs/googleapi';
import { cacheVideoBlob, getVideoBlob } from '@/recorder/cache/VideoCache';
import {
  useDocumentStore,
  useSetTakeExportedGoogleDriveFileId,
  useSetTakeExportedIDBKey,
} from '@/stores/document';
import {
  getDocumentById,
  getSceneIndex,
  getShotById,
  getShotIndex,
} from '@/stores/document';
import { createTake } from '@/stores/document/DocumentStore';
import { findNextAvailableShotHash } from '@/stores/document/dispatch/DispatchDocuments';
import { useSettingsStore } from '@/stores/settings';
import { downloadURLImpl } from '@/utils/Downloader';
import { getVideoFileExtensionByMIMEType } from '@/values/RecorderValues';

export function useTakeDownloader() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const assignAvailableShotHash = useDocumentStore(
    (ctx) => ctx.assignAvailableShotHash,
  );

  const downloadTake = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     */
    async function _downloadTake(documentId, sceneId, shotId, takeId) {
      const store = UNSAFE_getStore();
      const data = await getVideoBlob(takeId);
      if (!data) {
        return;
      }

      // NOTE: Generate the shot hash now-- since it may not exist.
      const shot = getShotById(store, documentId, shotId);
      const shotHash =
        shot.shotHash || findNextAvailableShotHash(store, documentId);
      if (shot.shotHash !== shotHash) {
        assignAvailableShotHash(documentId, shotId, shotHash);
      }

      const ext = getVideoFileExtensionByMIMEType(data.type);
      const exportedTakeName = getNextAvailableTakeNameForFileExport(
        store,
        documentId,
        sceneId,
        shotId,
        shotHash,
      );
      const exportedFileNameWithExt = `${exportedTakeName}${ext}`;

      // Download it.
      const dataURL = URL.createObjectURL(data);
      downloadURLImpl(exportedFileNameWithExt, dataURL);
      URL.revokeObjectURL(dataURL);
    },
    [UNSAFE_getStore, assignAvailableShotHash],
  );

  return downloadTake;
}

export function useTakeGoogleDriveUploader() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setTakeExportedGoogleDriveFileId = useDocumentStore(
    (ctx) => ctx.setTakeExportedGoogleDriveFileId,
  );
  const assignAvailableShotHash = useDocumentStore(
    (ctx) => ctx.assignAvailableShotHash,
  );
  const handleToken = useGAPITokenHandler();

  const uploadTake = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     */
    async function _uploadTake(documentId, sceneId, shotId, takeId) {
      const store = UNSAFE_getStore();
      const data = await getVideoBlob(takeId);
      if (!data) {
        return;
      }

      // NOTE: Generate the shot hash now-- since it may not exist.
      const shot = getShotById(store, documentId, shotId);
      const shotHash =
        shot.shotHash || findNextAvailableShotHash(store, documentId);
      if (shot.shotHash !== shotHash) {
        assignAvailableShotHash(documentId, shotId, shotHash);
      }

      const ext = getVideoFileExtensionByMIMEType(data.type);
      const exportedTakeName = getNextAvailableTakeNameForFileExport(
        store,
        documentId,
        sceneId,
        shotId,
        shotHash,
      );
      const exportedFileNameWithExt = `${exportedTakeName}${ext}`;

      // Upload it.
      handleToken((token) => {
        uploadFile(token.access_token, exportedFileNameWithExt, data.type, data)
          .then((fileId) => {
            setTakeExportedGoogleDriveFileId(documentId, takeId, fileId);
            console.log('Upload file - ' + exportedFileNameWithExt);
          })
          .catch(() => {
            console.error('Failed to upload file - ' + exportedFileNameWithExt);
          });
      });
    },
    [
      UNSAFE_getStore,
      handleToken,
      assignAvailableShotHash,
      setTakeExportedGoogleDriveFileId,
    ],
  );

  return uploadTake;
}

export function useTakeExporter() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const setTakeExportedGoogleDriveFileId =
    useSetTakeExportedGoogleDriveFileId();
  const setTakeExportedIDBKey = useSetTakeExportedIDBKey();
  const assignAvailableShotHash = useDocumentStore(
    (ctx) => ctx.assignAvailableShotHash,
  );
  const enableDriveSync = useSettingsStore((ctx) => ctx.user.enableDriveSync);
  const handleToken = useGAPITokenHandler();

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

      // NOTE: Generate the shot hash now-- since it may not exist.
      const shot = getShotById(store, documentId, shotId);
      const shotHash =
        shot.shotHash || findNextAvailableShotHash(store, documentId);
      if (shot.shotHash !== shotHash) {
        assignAvailableShotHash(documentId, shotId, shotHash);
      }

      const ext = getVideoFileExtensionByMIMEType(data.type);
      const exportedTakeName = getNextAvailableTakeNameForFileExport(
        store,
        documentId,
        sceneId,
        shotId,
        shotHash,
      );
      const exportedFileNameWithExt = `${exportedTakeName}${ext}`;

      let newTake = createTake();
      newTake.exportedFileName = exportedFileNameWithExt;
      newTake.exportedMillis = Date.now();
      newTake.exportedShotType = shot.shotType;
      newTake.exportedSize = data.size;
      if (opts?.targetTakeId) {
        newTake.takeId = opts.targetTakeId;
      }
      addTake(documentId, shotId, newTake);
      const takeId = newTake.takeId;

      // Always cache it-- just in case.
      cacheVideoBlob(takeId, data).then((key) =>
        setTakeExportedIDBKey(documentId, takeId, key),
      );

      if (enableDriveSync) {
        // Upload it.
        handleToken((token) => {
          uploadFile(
            token.access_token,
            exportedFileNameWithExt,
            data.type,
            data,
          )
            .then((fileId) => {
              setTakeExportedGoogleDriveFileId(documentId, takeId, fileId);
              console.log('Upload file - ' + exportedFileNameWithExt);
            })
            .catch(() => {
              console.error(
                'Failed to upload file - ' + exportedFileNameWithExt,
              );
            });
        });
      }
      return takeId;
    },
    [
      enableDriveSync,
      UNSAFE_getStore,
      addTake,
      handleToken,
      assignAvailableShotHash,
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
 * @param {import('@/stores/document/DocumentStore').ShotHash} shotHash
 */
export function getNextAvailableTakeNameForFileExport(
  store,
  documentId,
  sceneId,
  shotId,
  shotHash,
) {
  const document = getDocumentById(store, documentId);
  const projectId =
    document.settings.projectId || document.documentTitle || 'Untitled';
  const shot = getShotById(store, documentId, shotId);
  const sceneNumber = getSceneIndex(store, documentId, sceneId);
  const shotNumber = getShotIndex(store, documentId, sceneId, shotId);
  const takeNumber = shot.takeIds.length + 1;
  const shotType = shot.shotType;

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
