import {
  getSceneIndex,
  getShotIndex,
  getTakeIndex,
  useDocumentStore,
} from '@/stores/document';

import { useUserStore } from './UseUserStore';

export function useCurrentDocumentId() {
  return useUserStore((ctx) => ctx.cursor?.documentId);
}

export function useSetUserCursor() {
  return useUserStore((ctx) => ctx.setUserCursor);
}

export function useCurrentCursor() {
  return useUserStore((ctx) => ctx.cursor);
}

export function useCurrentSceneShotTakeNumbers() {
  const cursor = useUserStore((ctx) => ctx.cursor);
  const sceneIndex = useDocumentStore((ctx) =>
    getSceneIndex(ctx, cursor.documentId, cursor.sceneId),
  );
  const shotIndex = useDocumentStore((ctx) =>
    getShotIndex(ctx, cursor.documentId, cursor.sceneId, cursor.shotId),
  );
  const takeIndex = useDocumentStore((ctx) =>
    getTakeIndex(ctx, cursor.documentId, cursor.shotId, cursor.takeId),
  );
  return [sceneIndex, shotIndex, takeIndex];
}

export function useCurrentRecorder() {
  return useUserStore((ctx) => ctx.recorder);
}

export function useSetRecorderActive() {
  return useUserStore((ctx) => ctx.setRecorderActive);
}
