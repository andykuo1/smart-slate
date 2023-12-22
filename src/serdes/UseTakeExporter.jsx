import { useCallback } from 'react';

import { uploadFile, useGAPITokenHandler } from '@/lib/googleapi';
import { getVideoFileExtensionByMIMEType } from '@/recorder/MediaRecorderSupport';
import {
  getDocumentById,
  getSceneIndex,
  getShotById,
  getShotIndex,
} from '@/stores/DocumentDispatch';
import { createTake, toScenShotTakeType } from '@/stores/DocumentStore';
import {
  useDocumentStore,
  useSetTakeExportedGoogleDriveFileId,
  useSetTakePreviewImage,
} from '@/stores/DocumentStoreContext';
import { useSettingsStore } from '@/stores/SettingsStoreContext';
import { ANY_SHOT } from '@/stores/ShotTypes';
import { cacheVideoBlob } from '@/stores/VideoCache';
import { downloadURLImpl } from '@/utils/Downloader';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { captureVideoSnapshot } from '../recorder/snapshot/VideoSnapshot';

export function useTakeExporter() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const setTakeExportedGoogleDriveFileId =
    useSetTakeExportedGoogleDriveFileId();
  const setTakePreviewImage = useSetTakePreviewImage();
  const enableDriveSync = useSettingsStore((ctx) => ctx.user.enableDriveSync);
  const handleToken = useGAPITokenHandler();

  const exportTake = useCallback(
    /**
     * @param {Blob} data
     * @param {import('@/stores/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/DocumentStore').ShotId} shotId
     * @param {object} [opts]
     * @param {boolean} [opts.uploadOnly]
     * @param {import('@/stores/DocumentStore').TakeId} [opts.targetTakeId]
     * @returns {import('@/stores/DocumentStore').TakeId}
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
      if (opts?.targetTakeId) {
        newTake.takeId = opts.targetTakeId;
      }
      addTake(documentId, shotId, newTake);
      const takeId = newTake.takeId;

      // Process the video.
      captureVideoSnapshot(
        data,
        0.5,
        MAX_THUMBNAIL_WIDTH,
        MAX_THUMBNAIL_HEIGHT,
      ).then((url) => setTakePreviewImage(documentId, takeId, url));

      let shouldSave = true;
      let shouldCache = true;
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
        shouldCache = shouldSave;
      }
      if (shouldSave && !opts?.uploadOnly) {
        // Download it.
        const dataURL = URL.createObjectURL(data);
        downloadURLImpl(exportedFileNameWithExt, dataURL);
        URL.revokeObjectURL(dataURL);
        shouldSave = false;
      }
      if (shouldCache) {
        // Cache it.
        cacheVideoBlob(takeId, data);
        shouldCache = false;
      }
      return takeId;
    },
    [
      enableDriveSync,
      UNSAFE_getStore,
      addTake,
      handleToken,
      setTakeExportedGoogleDriveFileId,
      setTakePreviewImage,
    ],
  );

  return exportTake;
}

/**
 * @param {import('@/stores/DocumentStore').Store} store
 * @param {import('@/stores/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/DocumentStore').ShotId} shotId
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
