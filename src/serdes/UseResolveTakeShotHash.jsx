import { useCallback } from 'react';

import { getShotById, useDocumentStore } from '@/stores/document';
import { findNextAvailableShotHash } from '@/stores/document/dispatch/DispatchDocuments';

export function useResolveTakeShotHash() {
  const assignAvailableShotHash = useDocumentStore(
    (ctx) => ctx.assignAvailableShotHash,
  );
  const resolveTakeShotHash = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').Store} store
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     */
    function _resolveTakeShotHash(store, documentId, shotId) {
      // NOTE: Generate the shot hash now-- since it may not exist.
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
    [assignAvailableShotHash],
  );
  return resolveTakeShotHash;
}
