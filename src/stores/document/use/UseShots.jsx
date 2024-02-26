import { useShallow } from 'zustand/react/shallow';

import {
  getShotById,
  getShotIdsInBlockOrder,
  getShotIdsInDocumentOrder,
  getShotIdsInSceneOrder,
} from '../get/GetShots';
import { useDocumentStore } from './UseDocumentStore';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function useShotTakeCount(documentId, shotId) {
  return useDocumentStore(
    (ctx) =>
      Object.keys(getShotById(ctx, documentId, shotId)?.takeIds || {}).length ||
      0,
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function useShotIdsInSceneOrder(documentId, sceneId) {
  return useDocumentStore(
    useShallow((ctx) => getShotIdsInSceneOrder(ctx, documentId, sceneId)),
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function useShotIdsInDocumentOrder(documentId) {
  return useDocumentStore(
    useShallow((ctx) => getShotIdsInDocumentOrder(ctx, documentId)),
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function useLastShotIdInBlock(documentId, blockId) {
  return useDocumentStore((ctx) =>
    getShotIdsInBlockOrder(ctx, documentId, blockId).at(-1),
  );
}
