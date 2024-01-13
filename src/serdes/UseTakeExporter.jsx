import { useCallback } from 'react';

import { formatTakeNameForFileExport } from '@/components/takes/TakeNameFormat';
import { uploadFile, useGAPITokenHandler } from '@/libs/googleapi';
import { cacheVideoBlob, getVideoBlob } from '@/recorder/cache/VideoCache';
import {
  getTakeById,
  getTakeIndex,
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
  const resolveTakeFileName = useTakeFileNameResolver();
  const resolveTakeShotHash = useTakeShotHashResolver();

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

      const shotHash = resolveTakeShotHash(store, documentId, shotId);
      const takeFileName = resolveTakeFileName(
        store,
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
    [UNSAFE_getStore, resolveTakeShotHash, resolveTakeFileName],
  );

  return downloadTake;
}

export function useTakeGoogleDriveUploader() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useTakeFileNameResolver();
  const resolveTakeShotHash = useTakeShotHashResolver();

  const setTakeExportedGoogleDriveFileId = useDocumentStore(
    (ctx) => ctx.setTakeExportedGoogleDriveFileId,
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

      const shotHash = resolveTakeShotHash(store, documentId, shotId);
      const takeFileName = resolveTakeFileName(
        store,
        documentId,
        sceneId,
        shotId,
        takeId,
        shotHash,
        data.type,
      );

      // Upload it.
      handleToken((token) => {
        uploadFile(token.access_token, takeFileName, data.type, data)
          .then((fileId) => {
            setTakeExportedGoogleDriveFileId(documentId, takeId, fileId);
            console.log('Upload file - ' + takeFileName);
          })
          .catch(() => {
            console.error('Failed to upload file - ' + takeFileName);
          });
      });
    },
    [
      UNSAFE_getStore,
      handleToken,
      resolveTakeShotHash,
      resolveTakeFileName,
      setTakeExportedGoogleDriveFileId,
    ],
  );

  return uploadTake;
}

export function useDefineTake() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useTakeFileNameResolver();
  const resolveTakeShotHash = useTakeShotHashResolver();

  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const defineTake = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {object} [opts]
     * @param {import('@/stores/document/DocumentStore').TakeId} [opts.targetTakeId]
     * @returns {import('@/stores/document/DocumentStore').TakeId}
     */
    function defineTake(documentId, sceneId, shotId, opts = {}) {
      const store = UNSAFE_getStore();

      const takeShotHash = resolveTakeShotHash(store, documentId, shotId);
      const takeFileName = resolveTakeFileName(
        store,
        documentId,
        sceneId,
        shotId,
        '',
        takeShotHash,
        '',
      );

      const shot = getShotById(store, documentId, shotId);
      let newTake = createTake();
      newTake.exportedFileName = takeFileName;
      newTake.exportedMillis = Date.now();
      newTake.exportedShotType = shot?.shotType;
      newTake.exportedSize = -1;
      if (opts?.targetTakeId) {
        newTake.takeId = opts.targetTakeId;
      }
      addTake(documentId, shotId, newTake);
      return newTake.takeId;
    },
    [UNSAFE_getStore, addTake, resolveTakeShotHash, resolveTakeFileName],
  );

  return defineTake;
}

export function useTakeExporter() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useTakeFileNameResolver();
  const resolveTakeShotHash = useTakeShotHashResolver();

  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const setTakeExportedGoogleDriveFileId =
    useSetTakeExportedGoogleDriveFileId();
  const setTakeExportedIDBKey = useSetTakeExportedIDBKey();
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

      const takeShotHash = resolveTakeShotHash(store, documentId, shotId);
      const takeFileName = resolveTakeFileName(
        store,
        documentId,
        sceneId,
        shotId,
        '',
        takeShotHash,
        data.type,
      );

      const shot = getShotById(store, documentId, shotId);
      let newTake = createTake();
      newTake.exportedFileName = takeFileName;
      newTake.exportedMillis = Date.now();
      newTake.exportedShotType = shot?.shotType;
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
          uploadFile(token.access_token, takeFileName, data.type, data)
            .then((fileId) => {
              setTakeExportedGoogleDriveFileId(documentId, takeId, fileId);
              console.log('Upload file - ' + takeFileName);
            })
            .catch(() => {
              console.error('Failed to upload file - ' + takeFileName);
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
  const sceneNumber = getSceneIndex(store, documentId, sceneId);
  const shotNumber = getShotIndex(store, documentId, sceneId, shotId);
  const takeNumber = takeId
    ? getTakeIndex(store, documentId, shotId, takeId)
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

export function useTakeFileNameResolver() {
  const setTakeExportedFileName = useDocumentStore(
    (ctx) => ctx.setTakeExportedFileName,
  );

  const resolveTakeFileName = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').Store} store
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     * @param {import('@/stores/document/DocumentStore').ShotHash} shotHash
     * @param {string} mimeType
     */
    function _resolveTakeName(
      store,
      documentId,
      sceneId,
      shotId,
      takeId,
      shotHash,
      mimeType,
    ) {
      const take = getTakeById(store, documentId, takeId);
      let result = take?.exportedFileName;
      if (!result) {
        const ext = getVideoFileExtensionByMIMEType(mimeType);
        const exportedTakeName = getNextAvailableTakeNameForFileExport(
          store,
          documentId,
          sceneId,
          shotId,
          takeId,
          shotHash,
        );
        result = `${exportedTakeName}${ext}`;
        if (takeId) {
          setTakeExportedFileName(documentId, takeId, result);
        }
      }
      return result;
    },
    [setTakeExportedFileName],
  );

  return resolveTakeFileName;
}

export function useTakeShotHashResolver() {
  const assignAvailableShotHash = useDocumentStore(
    (ctx) => ctx.assignAvailableShotHash,
  );

  const resolveTakeShotHash = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').Store} store
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     */
    function _resolveTakeShotHash(store, documentId, shotId) {
      // NOTE: Generate the shot hash now-- since it may not exist.
      const shot = getShotById(store, documentId, shotId);
      if (!shot) {
        return '0000';
      }
      const result =
        shot.shotHash || findNextAvailableShotHash(store, documentId);
      if (shot.shotHash !== result) {
        assignAvailableShotHash(documentId, shotId, result);
      }
      return result;
    },
    [assignAvailableShotHash],
  );

  return resolveTakeShotHash;
}
