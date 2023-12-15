import { useCallback } from 'react';

import { uploadFile, useGAPITokenHandler } from '@/lib/googleapi';
import { getVideoFileExtensionByMIMEType } from '@/lib/mediarecorder';
import {
  getDocumentById,
  getSceneIndex,
  getShotById,
  getShotIndex,
} from '@/stores/DocumentDispatch';
import { createTake, toScenShotTakeType } from '@/stores/DocumentStore';
import { useDocumentStore } from '@/stores/DocumentStoreContext';
import { ANY_SHOT } from '@/stores/ShotTypes';
import { downloadURLImpl } from '@/utils/Downloader';

export function useTakeExporter() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const handleToken = useGAPITokenHandler();

  const exportTake = useCallback(
    /**
     * @param {Blob} data
     * @param {import('@/stores/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/DocumentStore').ShotId} shotId
     * @returns {import('@/stores/DocumentStore').TakeId}
     */
    function exportTake(data, documentId, sceneId, shotId) {
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
      addTake(documentId, shotId, newTake);

      if (
        // Upload it.
        !handleToken((token) => {
          uploadFile(
            token.access_token,
            exportedFileNameWithExt,
            data.type,
            data,
          )
            .then(() => {
              console.log('Upload file - ' + exportedFileNameWithExt);
            })
            .catch(() => {
              console.error(
                'Failed to upload file - ' + exportedFileNameWithExt,
              );
            });
        })
      ) {
        // Download it.
        const dataURL = URL.createObjectURL(data);
        downloadURLImpl(exportedFileNameWithExt, dataURL);
      }
      return newTake.takeId;
    },
    [UNSAFE_getStore, addTake, handleToken],
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
  const sceneNumber = getSceneIndex(store, documentId, sceneId) + 1;
  const shotNumber = getShotIndex(store, documentId, sceneId, shotId) + 1;
  const takeNumber = shot.takeIds.length;
  const shotType = shot.shotType;
  const [SCENE, SHOT, TAKE, TYPE] = toScenShotTakeType(
    sceneNumber,
    shotNumber,
    takeNumber,
    shotType,
  );
  return (
    `${documentTitle}_S${SCENE}${SHOT}_T${TAKE}` +
    (shotType !== ANY_SHOT.value ? `_${TYPE}` : '')
  );
}
