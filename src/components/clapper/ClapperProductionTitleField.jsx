import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function ClapperProductionTitleField({ className, documentId }) {
  const productionTitle = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );

  return (
    <input
      className={className}
      type="text"
      name="production-title"
      value={productionTitle}
      placeholder="Production title"
      disabled={true}
    />
  );
}
