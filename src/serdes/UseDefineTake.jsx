import { useCallback } from 'react';

import { getShotById, useDocumentStore } from '@/stores/document';
import { createTake } from '@/stores/document/DocumentStore';

import { useResolveTakeFileName } from './UseResolveTakeFileName';
import { useResolveTakeShotHash } from './UseResolveTakeShotHash';

export function useDefineTake() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useResolveTakeFileName();
  const resolveTakeShotHash = useResolveTakeShotHash();
  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const defineTake = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {object} [opts]
     * @param {import('@/stores/document/DocumentStore').TakeId} [opts.targetTakeId]
     * @returns {import('@/stores/document/DocumentStore').TakeId}
     */
    function _defineTake(documentId, sceneId, shotId, opts = {}) {
      const store = UNSAFE_getStore();

      const takeShotHash = resolveTakeShotHash(store, documentId, shotId);
      const takeFileName = resolveTakeFileName(
        store,
        documentId,
        sceneId,
        shotId,
        '',
        takeShotHash,
        '',
      );

      const shot = getShotById(store, documentId, shotId);
      let newTake = createTake();
      newTake.exportedFileName = takeFileName;
      newTake.exportedMillis = Date.now();
      newTake.exportedShotType = shot?.shotType;
      newTake.exportedSize = -1;
      if (opts?.targetTakeId) {
        newTake.takeId = opts.targetTakeId;
      }
      addTake(documentId, shotId, newTake);
      return newTake.takeId;
    },
    [UNSAFE_getStore, addTake, resolveTakeShotHash, resolveTakeFileName],
  );
  return defineTake;
}
