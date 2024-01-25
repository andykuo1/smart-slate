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
