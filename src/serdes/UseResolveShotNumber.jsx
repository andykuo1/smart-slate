import { useCallback } from 'react';

import {
  getSceneById,
  getSceneShotCount,
  getShotById,
  getShotOrder,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} [shotId]
 */
export function useShotNumber(documentId, sceneId, shotId) {
  const resolve = useResolveShotNumber();
  return useDocumentStore((ctx) => resolve(documentId, sceneId, shotId, true));
}

export function useResolveShotNumber() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setShotNumber = useDocumentStore((ctx) => ctx.setShotNumber);
  const resolveShotNumber = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} [shotId]
     * @param {boolean} [readonly]
     */
    function _resolveShotNumber(documentId, sceneId, shotId, readonly = false) {
      const store = UNSAFE_getStore();
      const scene = getSceneById(store, documentId, sceneId);
      if (!scene) {
        return -1;
      }
      let result;
      if (!shotId) {
        result = getSceneShotCount(store, documentId, sceneId) + 1;
      } else {
        const shot = getShotById(store, documentId, shotId);
        result = shot?.shotNumber;
        if (result > 0) {
          return result;
        }
        const shotOrder = getShotOrder(store, documentId, sceneId, shotId);
        if (shotOrder < 0) {
          return -1;
        }
        result = shotOrder;
      }
      if (!readonly && shotId) {
        setShotNumber(documentId, shotId, result);
      }
      return result;
    },
    [UNSAFE_getStore, setShotNumber],
  );
  return resolveShotNumber;
}
