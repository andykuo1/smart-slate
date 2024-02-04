import { useCallback } from 'react';

import { getLastBlockIdInScene, getShotById } from '@/stores/document';
import {
  createBlock,
  createShot,
  createTake,
} from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

import { useResolveSceneShotNumber } from './UseResolveSceneShotNumber';
import { useResolveShotHash } from './UseResolveShotHash';
import { useResolveTakeFileName } from './UseResolveTakeFileName';

export function useDefineTake() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useResolveTakeFileName();
  const resolveShotHash = useResolveShotHash();
  const resolveSceneShotNumber = useResolveSceneShotNumber();
  const addTake = useDocumentStore((ctx) => ctx.addTake);
  const addShot = useDocumentStore((ctx) => ctx.addShot);
  const addBlock = useDocumentStore((cxt) => cxt.addBlock);

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

      let shot = null;
      if (!shotId) {
        let blockId = getLastBlockIdInScene(store, documentId, sceneId);
        if (!blockId) {
          let block = createBlock();
          blockId = block.blockId;
          addBlock(documentId, sceneId, block);
        }
        shot = createShot();
        shotId = shot.shotId;
        addShot(documentId, sceneId, blockId, shot);
      } else {
        shot = getShotById(store, documentId, shotId);
      }

      // NOTE: Make sure these fields are defined whenever any take is
      //  created (most importantly, the first).
      resolveSceneShotNumber(documentId, sceneId, shotId, false);
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
      addBlock,
      addShot,
      resolveSceneShotNumber,
      resolveShotHash,
      resolveTakeFileName,
    ],
  );
  return defineTake;
}
