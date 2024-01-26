import { useCallback } from 'react';

import { formatTakeNameForFileExport } from '@/components/takes/TakeNameFormat';
import { getDocumentById, getShotById, getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { getVideoFileExtensionByMIMEType } from '@/values/RecorderValues';

import { useResolveSceneShotNumber } from './UseResolveSceneShotNumber';
import { useResolveShotHash } from './UseResolveShotHash';
import { useResolveTakeNumber } from './UseResolveTakeNumber';

export function useResolveTakeFileName() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setTakeExportedFileName = useDocumentStore(
    (ctx) => ctx.setTakeExportedFileName,
  );
  const resolveShotHash = useResolveShotHash();
  const resolveSceneShotNumber = useResolveSceneShotNumber();
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
      const sceneShotNumber = resolveSceneShotNumber(
        documentId,
        sceneId,
        shotId,
        readonly,
      );
      const ext = mimeType ? getVideoFileExtensionByMIMEType(mimeType) : '';
      const shot = getShotById(store, documentId, shotId);
      const shotType = shot?.shotType;
      const document = getDocumentById(store, documentId);
      const projectId =
        document?.settings?.projectId || document?.documentTitle || 'Untitled';
      const exportedTakeName = formatTakeNameForFileExport(
        projectId,
        sceneShotNumber,
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
      resolveSceneShotNumber,
      resolveTakeNumber,
      setTakeExportedFileName,
    ],
  );
  return resolveTakeFileName;
}
