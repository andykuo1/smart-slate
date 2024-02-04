import { getBlockById, getFirstBlockIdInScene } from '../get/GetBlocks';
import { getSceneById } from '../get/GetScenes';
import { getShotIdsInBlockOrder } from '../get/GetShots';
import { useDocumentStore } from './UseDocumentStore';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function useFirstBlockIdInScene(documentId, sceneId) {
  return useDocumentStore((ctx) =>
    getFirstBlockIdInScene(ctx, documentId, sceneId),
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function useBlockIdForShot(documentId, sceneId, shotId) {
  return useDocumentStore((ctx) =>
    getSceneById(ctx, documentId, sceneId)?.blockIds?.find((blockId) =>
      getBlockById(ctx, documentId, blockId)?.shotIds?.includes(shotId),
    ),
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function useBlockShotCount(documentId, blockId) {
  return useDocumentStore(
    (ctx) => getShotIdsInBlockOrder(ctx, documentId, blockId).length,
  );
}
