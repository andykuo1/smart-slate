import { getShotById } from '../get/GetShots';
import { getTakeById } from '../get/GetTakes';
import { useDocumentStore } from './UseDocumentStore';

/**
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {import('../DocumentStore').ShotId} shotId
 * @param {boolean} [referenceOnly]
 */
export function useBestTakeImageForShotThumbnail(
  documentId,
  shotId,
  referenceOnly = false,
) {
  return useDocumentStore((ctx) => {
    const shot = getShotById(ctx, documentId, shotId);
    if (!shot) {
      return '';
    }
    if (referenceOnly) {
      return shot.referenceImage;
    }
    let bestTake = null;
    let bestRating = 0;
    for (let takeId of shot.takeIds) {
      const take = getTakeById(ctx, documentId, takeId);
      if (!take) {
        continue;
      }
      if (take.rating >= bestRating) {
        bestTake = take;
        bestRating = take.rating;
      }
    }
    if (!bestTake) {
      return shot.referenceImage;
    }
    return bestTake.previewImage;
  });
}
