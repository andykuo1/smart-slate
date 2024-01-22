import { getDocumentSettingsById } from '../get/GetDocumentSettings';
import { useDocumentStore } from './UseDocumentStore';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function useProjectId(documentId) {
  return useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId || '',
  );
}
