import { useCallback } from 'react';

import { uploadFile, useGAPITokenHandler } from '@/libs/googleapi';
import { getVideoFileExtensionByMIMEType } from '@/recorder/MediaRecorderSupport';
import { cacheVideoBlob, getVideoBlob } from '@/recorder/cache/VideoCache';
import { ANY_SHOT } from '@/stores/ShotTypes';
import {
  useDocumentStore,
  useSetTakeExportedGoogleDriveFileId,
  useSetTakeExportedIDBKey,
  useSetTakePreviewImage,
} from '@/stores/document';
import {
  getDocumentById,
  getSceneIndex,
  getShotById,
  getShotIndex,
} from '@/stores/document';
import {
  createTake,
  toScenShotTakeType,
} from '@/stores/document/DocumentStore';
import { useSettingsStore } from '@/stores/settings';
import { downloadURLImpl } from '@/utils/Downloader';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { captureVideoSnapshot } from '../recorder/snapshot/VideoSnapshot';

export function useTakeDownloader() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);

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
      const ext = getVideoFileExtensionByMIMEType(data.type);
      const exportedTakeName = getExportedTakeName(
        store,
        documentId,
        sceneId,
        shotId,
      );
      const exportedFileNameWithExt = `${exportedTakeName}${ext}`;

      // Download it.
      const dataURL = URL.createObjectURL(data);
      downloadURLImpl(exportedFileNameWithExt, dataURL);
      URL.revokeObjectURL(dataURL);
    },
    [UNSAFE_getStore],
  );

  return downloadTake;
}

export function useTakeGoogleDriveUploader() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
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
      const ext = getVideoFileExtensionByMIMEType(data.type);
      const exportedTakeName = getExportedTakeName(
        store,
        documentId,
        sceneId,
        shotId,
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
    [UNSAFE_getStore, handleToken, setTakeExportedGoogleDriveFileId],
  );

  return uploadTake;
}

export function useTakeExporter() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const setTakeExportedGoogleDriveFileId =
    useSetTakeExportedGoogleDriveFileId();
  const setTakePreviewImage = useSetTakePreviewImage();
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
      const ext = getVideoFileExtensionByMIMEType(data.type);
      const exportedTakeName = getExportedTakeName(
        store,
        documentId,
        sceneId,
        shotId,
      );
      const exportedFileNameWithExt = `${exportedTakeName}${ext}`;

      let newTake = createTake();
      newTake.exportedFileName = exportedFileNameWithExt;
      newTake.exportedMillis = Date.now();
      newTake.exportedShotType = getShotById(
        store,
        documentId,
        shotId,
      ).shotType;
      newTake.exportedSize = data.size;
      if (opts?.targetTakeId) {
        newTake.takeId = opts.targetTakeId;
      }
      addTake(documentId, shotId, newTake);
      const takeId = newTake.takeId;

      // Always cache it-- just in case.
      cacheVideoBlob(takeId, data)
        .then((key) => setTakeExportedIDBKey(documentId, takeId, key))
        .then(() =>
          // Try to capture the video snapshot.
          captureVideoSnapshot(
            data,
            0.1,
            MAX_THUMBNAIL_WIDTH,
            MAX_THUMBNAIL_HEIGHT,
          ),
        )
        .then((url) => setTakePreviewImage(documentId, takeId, url));

      let shouldSave = true;
      if (shouldSave && enableDriveSync) {
        // Upload it.
        shouldSave = handleToken((token) => {
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
      if (shouldSave && !opts?.uploadOnly) {
        // Download it.
        const dataURL = URL.createObjectURL(data);
        downloadURLImpl(exportedFileNameWithExt, dataURL);
        URL.revokeObjectURL(dataURL);
        shouldSave = false;
      }
      return takeId;
    },
    [
      enableDriveSync,
      UNSAFE_getStore,
      addTake,
      handleToken,
      setTakeExportedGoogleDriveFileId,
      setTakeExportedIDBKey,
      setTakePreviewImage,
    ],
  );

  return exportTake;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
function getExportedTakeName(store, documentId, sceneId, shotId) {
  const document = getDocumentById(store, documentId);
  const documentTitle = document.documentTitle || 'Untitled';
  // TODO: What if documentTitle changes? Should we use this hash?
  /*
  const documentName =
    documentTitle.charAt(0).toUpperCase() + documentId.substring(0, 4);
  */
  const shot = getShotById(store, documentId, shotId);
  const sceneNumber = getSceneIndex(store, documentId, sceneId);
  const shotNumber = getShotIndex(store, documentId, sceneId, shotId);
  const takeNumber = shot.takeIds.length + 1;
  const shotType = shot.shotType;
  const [SCENE, SHOT, TAKE, TYPE] = toScenShotTakeType(
    sceneNumber,
    shotNumber,
    takeNumber,
    shotType,
  );
  return (
    `${documentTitle}_${SCENE}${SHOT}_${TAKE}` +
    (shotType !== ANY_SHOT.value ? `_${TYPE}` : '')
  );
}
