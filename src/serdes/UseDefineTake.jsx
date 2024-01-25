import { useCallback } from 'react';

import { getShotById } from '@/stores/document';
import { createTake } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

import { useResolveShotHash } from './UseResolveShotHash';
import { useResolveShotName } from './UseResolveShotName';
import { useResolveTakeFileName } from './UseResolveTakeFileName';

export function useDefineTake() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useResolveTakeFileName();
  const resolveShotHash = useResolveShotHash();
  const resolveShotName = useResolveShotName();
  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const defineTake = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {object} [opts]
     * @param {import('@/stores/document/DocumentStore').TakeId} [opts.targetTakeId]
     * @param {string} [opts.dataType]
     * @param {number} [opts.dataSize]
     * @returns {Readonly<import('@/stores/document/DocumentStore').Take>}
     */
    function _defineTake(documentId, sceneId, shotId, opts = {}) {
      const store = UNSAFE_getStore();

      // NOTE: Make sure these fields are defined whenever any take is
      //  created (most importantly, the first).
      resolveShotName(documentId, sceneId, shotId, false);
      resolveShotHash(documentId, shotId, false);

      // Since the take isn't created yet, this can only be readonly.
      const takeFileName = resolveTakeFileName(
        documentId,
        sceneId,
        shotId,
        '',
        opts?.dataType || '',
        true,
      );

      const shot = getShotById(store, documentId, shotId);
      let newTake = createTake();
      newTake.exportDetails.fileName = takeFileName;
      newTake.exportDetails.timestampMillis = Date.now();
      newTake.exportDetails.shotType = shot?.shotType;
      newTake.exportDetails.sizeBytes = opts?.dataSize ?? -1;
      if (opts?.targetTakeId) {
        newTake.takeId = opts.targetTakeId;
      }
      addTake(documentId, shotId, newTake);
      return newTake;
    },
    [
      UNSAFE_getStore,
      addTake,
      resolveShotName,
      resolveShotHash,
      resolveTakeFileName,
    ],
  );
  return defineTake;
}
