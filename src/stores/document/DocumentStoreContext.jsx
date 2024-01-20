import { useShallow } from 'zustand/react/shallow';

import {
  getBlockIdsInOrder,
  getSceneById,
  getSceneNumber,
  getShotById,
  getShotIdsInOrder,
  getShotNumber,
  getTakeById,
  getTakeIdsInOrder,
  getTakeNumber,
} from './get';
import { useDocumentStore } from './use/UseDocumentStore';

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
  return useDocumentStore((ctx) => getSceneNumber(ctx, documentId, sceneId));
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').SceneId} sceneId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function useShotNumber(documentId, sceneId, shotId) {
  return useDocumentStore((ctx) =>
    getShotNumber(ctx, documentId, sceneId, shotId),
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function useTakeNumber(documentId, shotId, takeId) {
  return useDocumentStore((ctx) =>
    getTakeNumber(ctx, documentId, shotId, takeId),
  );
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

export function useSetTakeExportedGoogleDriveFileId() {
  return useDocumentStore((ctx) => ctx.setTakeExportedGoogleDriveFileId);
}

export function useSetTakePreviewImage() {
  return useDocumentStore((ctx) => ctx.setTakePreviewImage);
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
