import { useCallback } from 'react';

import { formatTakeNameForFileExport } from '@/components/takes/TakeNameFormat';
import { getDocumentById, getShotById, getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { getVideoFileExtensionByMIMEType } from '@/values/RecorderValues';

import { useResolveShotHash } from './UseResolveShotHash';
import { useResolveShotName } from './UseResolveShotName';
import { useResolveTakeNumber } from './UseResolveTakeNumber';

export function useResolveTakeFileName() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setTakeExportedFileName = useDocumentStore(
    (ctx) => ctx.setTakeExportedFileName,
  );
  const resolveShotHash = useResolveShotHash();
  const resolveShotName = useResolveShotName();
  const resolveTakeNumber = useResolveTakeNumber();

  const resolveTakeFileName = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     * @param {string} mimeType
     * @param {boolean} [readonly]
     */
    function _resolveTakeName(
      documentId,
      sceneId,
      shotId,
      takeId,
      mimeType,
      readonly = false,
    ) {
      const store = UNSAFE_getStore();
      const take = getTakeById(store, documentId, takeId);
      let result = take?.exportDetails?.fileName;
      if (result) {
        return result;
      }
      const takeNumber = resolveTakeNumber(
        documentId,
        shotId,
        takeId,
        readonly,
      );
      const shotHash = resolveShotHash(documentId, shotId, readonly);
      const shotName = resolveShotName(documentId, sceneId, shotId, readonly, {
        undecorated: true,
      });
      const ext = mimeType ? getVideoFileExtensionByMIMEType(mimeType) : '';
      const shot = getShotById(store, documentId, shotId);
      const shotType = shot?.shotType;
      const document = getDocumentById(store, documentId);
      const projectId =
        document?.settings?.projectId || document?.documentTitle || 'Untitled';
      const exportedTakeName = formatTakeNameForFileExport(
        projectId,
        shotName,
        takeNumber,
        shotHash,
        shotType,
      );
      result = `${exportedTakeName}${ext}`;
      if (!readonly && takeId) {
        setTakeExportedFileName(documentId, takeId, result);
      }
      return result;
    },
    [
      UNSAFE_getStore,
      resolveShotHash,
      resolveShotName,
      resolveTakeNumber,
      setTakeExportedFileName,
    ],
  );
  return resolveTakeFileName;
}
