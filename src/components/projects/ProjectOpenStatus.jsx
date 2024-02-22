import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import { getDocumentById, getDocumentSettingsById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function ProjectOpenStatus({ className, documentId }) {
  const autoSaveTo = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.autoSaveTo,
  );
  const lastExportedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastExportedMillis,
  );
  const googleStatus = useGoogleStatus();
  if (
    (autoSaveTo === '' || autoSaveTo === 'local') &&
    lastExportedMillis <= 0 &&
    googleStatus
  ) {
    return 'Upload';
  }
  return 'Open';
}
