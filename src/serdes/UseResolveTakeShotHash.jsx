import { useCallback } from 'react';

import { getShotById } from '@/stores/document';
import { findNextAvailableShotHash } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';

export function useResolveTakeShotHash() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const assignAvailableShotHash = useDocumentStore(
    (ctx) => ctx.assignAvailableShotHash,
  );
  const resolveTakeShotHash = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     */
    function _resolveTakeShotHash(documentId, shotId) {
      const store = UNSAFE_getStore();
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
    [UNSAFE_getStore, assignAvailableShotHash],
  );
  return resolveTakeShotHash;
}
