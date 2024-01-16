import { useCallback } from 'react';

import { getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

import { useResolveTakeFileName } from './UseResolveTakeFileName';
import { useResolveTakeShotHash } from './UseResolveTakeShotHash';

export function useResolveTakeQRCodeKey() {
  const setTakeExportedQRCodeKey = useDocumentStore(
    (ctx) => ctx.setTakeExportedQRCodeKey,
  );
  const resolveTakeShotHash = useResolveTakeShotHash();
  const resolveTakeFileName = useResolveTakeFileName();
  const resolveTakeQRCodeKey = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').Store} store
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     */
    function _resolveTakeQRCodeKey(store, documentId, sceneId, shotId, takeId) {
      const take = getTakeById(store, documentId, takeId);
      let result = take?.exportedQRCodeKey;
      if (result) {
        return result;
      }

      const takeShotHash = resolveTakeShotHash(store, documentId, shotId);
      const takeFileName = resolveTakeFileName(
        store,
        documentId,
        sceneId,
        shotId,
        takeId,
        takeShotHash,
        '',
      );

      // Trim ext from file name
      let takeFileNameWithoutExt = takeFileName;
      const extIndex = takeFileName.lastIndexOf('.');
      if (extIndex >= 0) {
        takeFileNameWithoutExt = takeFileName.substring(0, extIndex);
      }

      const jsonData = JSON.stringify({ key: takeFileNameWithoutExt });
      const base64 = btoa(jsonData);
      result = 'https://jsonhero.io/new?j=' + base64;
      setTakeExportedQRCodeKey(documentId, takeId, result);
      return result;
    },
    [
      getTakeById,
      resolveTakeFileName,
      resolveTakeShotHash,
      setTakeExportedQRCodeKey,
    ],
  );
  return resolveTakeQRCodeKey;
}
