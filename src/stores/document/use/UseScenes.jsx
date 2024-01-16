import { useShallow } from 'zustand/react/shallow';

import { getSceneById, getSceneIdsInOrder } from '../get/GetScenes';
import { getShotIdsInOrder } from '../get/GetShots';
import { useDocumentStore } from './UseDocumentStore';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function useSceneShotCount(documentId, sceneId) {
  return useDocumentStore((ctx) =>
    getSceneById(ctx, documentId, sceneId).blockIds.reduce(
      (prev, blockId) =>
        prev + getShotIdsInOrder(ctx, documentId, blockId)?.length || 0,
      0,
    ),
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function useSceneIds(documentId) {
  return useDocumentStore(
    useShallow((ctx) => getSceneIdsInOrder(ctx, documentId)),
  );
}
