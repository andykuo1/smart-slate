import { useCallback } from 'react';

import { getShotById } from '@/stores/document';
import { findNextAvailableShotHash } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';

export function useResolveShotHash() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const assignAvailableShotHash = useDocumentStore(
    (ctx) => ctx.assignAvailableShotHash,
  );
  const resolveShotHash = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {boolean} [readonly]
     */
    function _resolveShotHash(documentId, shotId, readonly = false) {
      const store = UNSAFE_getStore();
      const shot = getShotById(store, documentId, shotId);
      if (!shot) {
        return '0000';
      }
      let result = shot.shotHash;
      if (result?.length > 0) {
        return result;
      }
      result = findNextAvailableShotHash(store, documentId);
      if (!readonly && shotId) {
        assignAvailableShotHash(documentId, shotId, result);
      }
      return result;
    },
    [UNSAFE_getStore, assignAvailableShotHash],
  );
  return resolveShotHash;
}
