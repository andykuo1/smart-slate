import { useCallback } from 'react';

import { getShotById, getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

export function useResolveTakeNumber() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setTakeNumber = useDocumentStore((ctx) => ctx.setTakeNumber);
  const resolveTakeNumber = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} [takeId]
     * @param {boolean} [readonly]
     */
    function _resolveTakeNumber(documentId, shotId, takeId, readonly = false) {
      const store = UNSAFE_getStore();
      const shot = getShotById(store, documentId, shotId);
      if (!shot) {
        return -1;
      }
      let result = -1;
      if (!takeId) {
        result = shot.takeIds.length + 1;
      } else {
        const take = getTakeById(store, documentId, takeId);
        result = take?.takeNumber;
        if (result > 0) {
          return result;
        } else {
          let index = Number(shot.takeIds.indexOf(takeId));
          if (index < 0) {
            return -1;
          }
          result = index + 1;
        }
      }

      if (!readonly && takeId) {
        setTakeNumber(documentId, takeId, result);
      }
      return result;
    },
    [UNSAFE_getStore, setTakeNumber],
  );
  return resolveTakeNumber;
}
