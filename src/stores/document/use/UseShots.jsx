import { getShotById } from '../get/GetShots';
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
