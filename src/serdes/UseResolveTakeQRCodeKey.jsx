import { useCallback } from 'react';

import { getDocumentSettingsById, getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

import { useResolveTakeFileName } from './UseResolveTakeFileName';
import { useResolveTakeShotHash } from './UseResolveTakeShotHash';

export function useResolveTakeQRCodeKey() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setTakeExportedQRCodeKey = useDocumentStore(
    (ctx) => ctx.setTakeExportedQRCodeKey,
  );
  const resolveTakeShotHash = useResolveTakeShotHash();
  const resolveTakeFileName = useResolveTakeFileName();
  const resolveTakeQRCodeKey = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     * @param {boolean} [readonly]
     */
    function _resolveTakeQRCodeKey(
      documentId,
      sceneId,
      shotId,
      takeId,
      readonly = false,
    ) {
      const store = UNSAFE_getStore();
      const take = getTakeById(store, documentId, takeId);
      let result = take?.exportDetails?.qrCodeKey;
      if (result) {
        return result;
      }
      const documentSettings = getDocumentSettingsById(store, documentId);
      const projectId = documentSettings?.projectId || '';
      const shotHash = resolveTakeShotHash(documentId, shotId);
      const jsonData = JSON.stringify([takeId, projectId, shotHash]);
      const base64 = btoa(jsonData);
      result = 'json:' + base64;
      if (!readonly && takeId) {
        setTakeExportedQRCodeKey(documentId, takeId, result);
      }
      return result;
    },
    [
      UNSAFE_getStore,
      resolveTakeFileName,
      resolveTakeShotHash,
      setTakeExportedQRCodeKey,
    ],
  );
  return resolveTakeQRCodeKey;
}
