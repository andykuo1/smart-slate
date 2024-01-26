import { useCallback } from 'react';

import {
  formatProjectId,
  getDefaultProjectIdByDate,
} from '@/components/takes/TakeNameFormat';
import { getDocumentById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

export const COLLIDABLE_DEFAULT_PROJECT_IDS = ['UNTITLED', 'MYMOVIE'];

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {string} [documentTitle]
 */
export function useDocumentProjectId(documentId, documentTitle) {
  const resolve = useResolveDocumentProjectId();
  return useDocumentStore((ctx) => resolve(documentId, documentTitle, true));
}

export function useResolveDocumentProjectId() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setDocumentSettingsProjectId = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsProjectId,
  );
  const resolveDocumentProjectId = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {string} [documentTitle]
     * @param {boolean} [readonly]
     */
    function _resolveDocumentProjectId(
      documentId,
      documentTitle = '',
      readonly = false,
    ) {
      const store = UNSAFE_getStore();
      const document = getDocumentById(store, documentId);
      let result = document?.settings?.projectId;
      if (result) {
        return result;
      }
      if (!documentTitle) {
        documentTitle = document?.documentTitle || 'Untitled';
      }
      result = formatProjectId(documentTitle);
      if (COLLIDABLE_DEFAULT_PROJECT_IDS.includes(result)) {
        const firstCreatedDate =
          new Date(document?.firstCreatedMillis) || new Date();
        result = getDefaultProjectIdByDate(firstCreatedDate);
      }
      if (!readonly && documentId) {
        setDocumentSettingsProjectId(documentId, result);
      }
      return result;
    },
    [UNSAFE_getStore, setDocumentSettingsProjectId],
  );
  return resolveDocumentProjectId;
}
