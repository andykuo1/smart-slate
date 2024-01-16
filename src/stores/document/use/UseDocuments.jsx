import { useShallow } from 'zustand/react/shallow';

import { getDocumentIds } from '../get/GetDocuments';
import { getSceneIdsInOrder } from '../get/GetScenes';
import { useDocumentStore } from './UseDocumentStore';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function useDocumentSceneCount(documentId) {
  return useDocumentStore((ctx) => getSceneIdsInOrder(ctx, documentId).length);
}

export function useDocumentIds() {
  return useDocumentStore(useShallow((ctx) => getDocumentIds(ctx)));
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
