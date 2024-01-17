import { formatProjectId } from '@/components/takes/TakeNameFormat';
import { getDocumentById } from '@/stores/document';

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {string} prefix
 * @param {string} name
 * @param {string} ext
 */
export function formatExportName(store, documentId, prefix, name, ext) {
  const document = getDocumentById(store, documentId);
  const projectId = formatProjectId(
    document?.settings?.projectId || document?.documentTitle,
  );
  const date = new Date();
  const year = String(date.getFullYear()).substring(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate() + 1).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  const dateString = `${year}${month}${day}_${hour}${minute}${second}`;
  return `${prefix ? `${prefix}_` : ''}${projectId}_${
    name ? `${name}_` : ''
  }${dateString}${ext ? `.${ext}` : ''}`;
}
