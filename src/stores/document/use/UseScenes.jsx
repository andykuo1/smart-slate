import { useShallow } from 'zustand/react/shallow';

import { getSceneIdsInOrder } from '../get/GetScenes';
import { getShotIdsInSceneOrder } from '../get/GetShots';
import { useDocumentStore } from './UseDocumentStore';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function useSceneShotCount(documentId, sceneId) {
  return useDocumentStore(
    (ctx) => getShotIdsInSceneOrder(ctx, documentId, sceneId)?.length || 0,
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

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function useSceneIdsInDocumentOrder(documentId) {
  return useDocumentStore(
    useShallow((ctx) => getSceneIdsInOrder(ctx, documentId)),
  );
}
