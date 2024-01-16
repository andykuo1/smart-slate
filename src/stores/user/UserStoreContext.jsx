import {
  getSceneNumber,
  getShotNumber,
  getTakeNumber,
} from '@/stores/document';

import { useDocumentStore } from '../document/use';
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
    getSceneNumber(ctx, cursor.documentId, cursor.sceneId),
  );
  const shotNumber = useDocumentStore((ctx) =>
    getShotNumber(ctx, cursor.documentId, cursor.sceneId, cursor.shotId),
  );
  const takeIndex = useDocumentStore((ctx) =>
    getTakeNumber(ctx, cursor.documentId, cursor.shotId, cursor.takeId),
  );
  return [sceneIndex, shotNumber, takeIndex];
}

export function useCurrentRecorder() {
  return useUserStore((ctx) => ctx.recorder);
}

export function useSetRecorderActive() {
  return useUserStore((ctx) => ctx.setRecorderActive);
}
