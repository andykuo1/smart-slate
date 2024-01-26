import { useCallback } from 'react';

import {
  getDocumentById,
  getSceneById,
  getSceneOrder,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function useSceneNumber(documentId, sceneId) {
  const resolve = useResolveSceneNumber();
  return useDocumentStore((ctx) => resolve(documentId, sceneId, true));
}

export function useResolveSceneNumber() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setSceneNumber = useDocumentStore((ctx) => ctx.setSceneNumber);
  const resolveSceneNumber = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} [sceneId]
     * @param {boolean} [readonly]
     */
    function _resolveSceneNumber(documentId, sceneId, readonly = false) {
      const store = UNSAFE_getStore();
      const document = getDocumentById(store, documentId);
      if (!document) {
        return -1;
      }

      let result = -1;
      if (!sceneId) {
        result = Object.keys(document.scenes).length;
      } else {
        const scene = getSceneById(store, documentId, sceneId);
        result = scene?.sceneNumber;
        if (result > 0) {
          return result;
        }
        const sceneOrder = getSceneOrder(store, documentId, sceneId);
        if (sceneOrder < 0) {
          return -1;
        }
        result = sceneOrder;
      }

      if (!readonly && sceneId) {
        setSceneNumber(documentId, sceneId, result);
      }
      return result;
    },
    [UNSAFE_getStore, setSceneNumber],
  );
  return resolveSceneNumber;
}
