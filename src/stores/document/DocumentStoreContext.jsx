import { useShallow } from 'zustand/react/shallow';

import {
  getBlockIdsInOrder,
  getDocumentIds,
  getSceneById,
  getSceneIdsInOrder,
  getSceneIndex,
  getShotById,
  getShotIdsInOrder,
  getShotIndex,
  getTakeById,
  getTakeIdsInOrder,
  getTakeIndex,
} from './DocumentStoreHelper';
import { useDocumentStore } from './UseDocumentStore';

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @returns {[string, import('./DocumentDispatch').Dispatch['setDocumentTitle']]}
 */
export function useDocumentTitle(documentId) {
  return useDocumentStore(
    useShallow((ctx) => [
      ctx.documents?.[documentId]?.documentTitle || '',
      ctx.setDocumentTitle,
    ]),
  );
}

export function useDocumentIds() {
  return useDocumentStore(useShallow((ctx) => getDocumentIds(ctx)));
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function useDocumentLastUpdatedMillis(documentId) {
  return useDocumentStore(
    (ctx) => ctx.documents?.[documentId]?.lastUpdatedMillis || 0,
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function useSceneIds(documentId) {
  return useDocumentStore(
    useShallow((ctx) => getSceneIdsInOrder(ctx, documentId)),
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 */
export function useBlockIds(documentId, sceneId) {
  return useDocumentStore(
    useShallow((ctx) => getBlockIdsInOrder(ctx, documentId, sceneId)),
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').BlockId} blockId
 */
export function useShotIds(documentId, blockId) {
  return useDocumentStore(
    useShallow((ctx) => getShotIdsInOrder(ctx, documentId, blockId)),
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function useTakeIds(documentId, shotId) {
  return useDocumentStore(
    useShallow((ctx) => getTakeIdsInOrder(ctx, documentId, shotId)),
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 */
export function useSceneNumber(documentId, sceneId) {
  return useDocumentStore((ctx) => getSceneIndex(ctx, documentId, sceneId));
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function useShotNumber(documentId, sceneId, shotId) {
  return useDocumentStore((ctx) =>
    getShotIndex(ctx, documentId, sceneId, shotId),
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function useTakeNumber(documentId, shotId, takeId) {
  return useDocumentStore((ctx) =>
    getTakeIndex(ctx, documentId, shotId, takeId),
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
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
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').BlockId} blockId
 */
export function useBlockShotCount(documentId, blockId) {
  return useDocumentStore((ctx) => getShotIdsInOrder(ctx, documentId, blockId));
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function useDocumentSceneCount(documentId) {
  return useDocumentStore((ctx) => getSceneIdsInOrder(ctx, documentId).length);
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function useShotType(documentId, shotId) {
  return (
    useDocumentStore((ctx) => getShotById(ctx, documentId, shotId)?.shotType) ||
    ''
  );
}

export function useSetShotType() {
  return useDocumentStore((ctx) => ctx.setShotType);
}

export function useAddDocument() {
  return useDocumentStore((ctx) => ctx.addDocument);
}

export function useAddScene() {
  return useDocumentStore((ctx) => ctx.addScene);
}

export function useAddShot() {
  return useDocumentStore((ctx) => ctx.addShot);
}

export function useAddTake() {
  return useDocumentStore((ctx) => ctx.addTake);
}

export function useAddBlock() {
  return useDocumentStore((ctx) => ctx.addBlock);
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function useShotTakeCount(documentId, shotId) {
  return useDocumentStore(
    (ctx) =>
      Object.keys(getShotById(ctx, documentId, shotId)?.takeIds || {}).length ||
      0,
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function useShotDescription(documentId, shotId) {
  return useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.description,
  );
}

export function useSetShotDescription() {
  return useDocumentStore((ctx) => ctx.setShotDescription);
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function useTake(documentId, takeId) {
  return useDocumentStore((ctx) => getTakeById(ctx, documentId, takeId));
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function useShotThumbnail(documentId, shotId) {
  return useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.thumbnail || '',
  );
}

export function useSetShotThumbnail() {
  return useDocumentStore((ctx) => ctx.setShotThumbnail);
}

export function useSetTakeExportedGoogleDriveFileId() {
  return useDocumentStore((ctx) => ctx.setTakeExportedGoogleDriveFileId);
}

export function useSetTakePreviewImage() {
  return useDocumentStore((ctx) => ctx.setTakePreviewImage);
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
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
      return shot.thumbnail;
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
      return shot.thumbnail;
    }
    return bestTake.previewImage;
  });
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 * @returns {[string, import('./DocumentDispatch').Dispatch['setSceneHeading']]}
 */
export function useSceneHeading(documentId, sceneId) {
  return useDocumentStore(
    useShallow((ctx) => [
      getSceneById(ctx, documentId, sceneId)?.sceneHeading,
      ctx.setSceneHeading,
    ]),
  );
}

export function useSetSceneHeading() {
  return useDocumentStore((ctx) => ctx.setSceneHeading);
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function useTakeRating(documentId, takeId) {
  return useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.rating || 0,
  );
}

export function useSetTakeRating() {
  return useDocumentStore((ctx) => ctx.setTakeRating);
}

export function useSetTakeExportedIDBKey() {
  return useDocumentStore((ctx) => ctx.setTakeExportedIDBKey);
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function useTakeExportedIDBKey(documentId, takeId) {
  return useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.exportedIDBKey,
  );
}
