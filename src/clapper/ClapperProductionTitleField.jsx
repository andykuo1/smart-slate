import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';

import ClapperInput from './ClapperInput';

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
    <ClapperInput
      className={className}
      name="production-title"
      value={productionTitle || ''}
      placeholder="MY PRODUCTION"
      onChange={() => {}}
      disabled={true}
    />
  );
}
