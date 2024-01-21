import { useCallback } from 'react';

import { getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { getVideoFileExtensionByMIMEType } from '@/values/RecorderValues';

import { getNextAvailableTakeNameForFileExport } from './UseTakeExporter';

export function useResolveTakeFileName() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setTakeExportedFileName = useDocumentStore(
    (ctx) => ctx.setTakeExportedFileName,
  );
  const resolveTakeFileName = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     * @param {import('@/stores/document/DocumentStore').ShotHash} shotHash
     * @param {string} mimeType
     * @param {boolean} [readonly]
     */
    function _resolveTakeName(
      documentId,
      sceneId,
      shotId,
      takeId,
      shotHash,
      mimeType,
      readonly = false,
    ) {
      const store = UNSAFE_getStore();
      const take = getTakeById(store, documentId, takeId);
      let result = take?.exportDetails?.fileName;
      if (result) {
        return result;
      }
      const ext = mimeType ? getVideoFileExtensionByMIMEType(mimeType) : '';
      const exportedTakeName = getNextAvailableTakeNameForFileExport(
        store,
        documentId,
        sceneId,
        shotId,
        takeId,
        shotHash,
      );
      result = `${exportedTakeName}${ext}`;
      if (!readonly && takeId) {
        setTakeExportedFileName(documentId, takeId, result);
      }
      return result;
    },
    [UNSAFE_getStore, setTakeExportedFileName],
  );
  return resolveTakeFileName;
}
