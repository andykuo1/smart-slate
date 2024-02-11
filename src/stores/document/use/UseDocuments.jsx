import { useShallow } from 'zustand/react/shallow';

import { getDocumentById, getDocumentIds } from '../get/GetDocuments';
import { getSceneIdsInOrder } from '../get/GetScenes';
import { useDocumentStore } from './UseDocumentStore';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function useDocumentSceneCount(documentId) {
  return useDocumentStore((ctx) => getSceneIdsInOrder(ctx, documentId).length);
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function useDocumentShotCount(documentId) {
  return useDocumentStore(
    (ctx) => Object.keys(getDocumentById(ctx, documentId)?.takes || []).length,
  );
}

export function useDocumentIds() {
  return useDocumentStore(useShallow((ctx) => getDocumentIds(ctx)));
}

export function useActiveDocumentIds() {
  return useDocumentStore(
    useShallow((ctx) =>
      getDocumentIds(ctx).filter(
        (documentId) =>
          getDocumentById(ctx, documentId)?.lastDeletedMillis <= 0,
      ),
    ),
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @returns {[string, import('@/stores/document/DocumentDispatch').Dispatch['setDocumentTitle']]}
 */
export function useDocumentTitle(documentId) {
  return useDocumentStore(
    useShallow((ctx) => [
      ctx.documents?.[documentId]?.documentTitle || '',
      ctx.setDocumentTitle,
    ]),
  );
}
