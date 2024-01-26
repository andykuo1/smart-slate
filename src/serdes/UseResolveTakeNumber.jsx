import { useCallback } from 'react';

import { getShotById, getTakeById, getTakeOrder } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} [takeId]
 */
export function useTakeNumber(documentId, shotId, takeId) {
  const resolve = useResolveTakeNumber();
  return useDocumentStore((ctx) => resolve(documentId, shotId, takeId, true));
}

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
      let result;
      if (!takeId) {
        result = shot.takeIds.length + 1;
      } else {
        const take = getTakeById(store, documentId, takeId);
        result = take?.takeNumber;
        if (result > 0) {
          return result;
        }
        const takeOrder = getTakeOrder(store, documentId, shotId, takeId);
        if (takeOrder < 0) {
          return -1;
        }
        result = takeOrder;
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
