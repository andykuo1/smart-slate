import { useShallow } from 'zustand/react/shallow';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  createDispatch,
  getDocumentIds,
  getSceneIdsInOrder,
  getSceneIndex,
  getShotById,
  getShotIdsInOrder,
  getShotIndex,
  getTakeIdsInOrder,
  getTakeIndex,
} from './DocumentDispatch';
import { createStore } from './DocumentStore';

export const LOCAL_STORAGE_KEY = 'documentStore';

/** @typedef {import('./DocumentStore').Store & import('./DocumentDispatch').Dispatch} StoreAndDispatch */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
export const useDocumentStore = create(
  persist(
    (set) => ({
      ...createStore(),
      // @ts-ignore
      ...createDispatch(set),
    }),
    {
      name: LOCAL_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function useDocument(documentId) {
  return useDocumentStore((ctx) => ctx.documents[documentId]);
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function useDocumentTitle(documentId) {
  return useDocumentStore((ctx) => ctx.documents?.[documentId]?.documentTitle);
}

export function useSetDocumentTitle() {
  return useDocumentStore((ctx) => ctx.setDocumentTitle);
}

export function useDocumentIds() {
  return useDocumentStore(useShallow((ctx) => getDocumentIds(ctx)));
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 */
export function useDocumentLastUpdatedMillis(documentId) {
  return useDocumentStore(
    (ctx) => ctx.documents?.[documentId]?.lastUpdatedMillis,
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
export function useShotIds(documentId, sceneId) {
  return useDocumentStore((ctx) => getShotIdsInOrder(ctx, documentId, sceneId));
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
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function useShotType(documentId, shotId) {
  return (
    useDocumentStore((ctx) => getShotById(ctx, documentId, shotId)?.shotType) ||
    ''
  );
}

/**
 * @param {import('./DocumentStore').DocumentId} documentId
 * @param {import('./DocumentStore').ShotId} shotId
 */
export function useSetShotType(documentId, shotId) {
  return useDocumentStore((ctx) => ctx.setShotType);
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
