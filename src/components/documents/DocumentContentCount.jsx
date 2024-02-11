import { getDocumentById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentContentCount({ className, documentId }) {
  const sceneCount = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.sceneOrder?.length,
  );
  const shotCount = useDocumentStore(
    (ctx) => Object.keys(getDocumentById(ctx, documentId)?.shots || {}).length,
  );
  const takeCount = useDocumentStore(
    (ctx) => Object.keys(getDocumentById(ctx, documentId)?.takes || {}).length,
  );
  return (
    <output
      className={
        'mx-auto flex gap-1 whitespace-nowrap text-xs opacity-30' +
        ' ' +
        className
      }>
      <span>{sceneCount} scenes</span>
      <span>/</span>
      <span>{shotCount} shots</span>
      <span>/</span>
      <span>{takeCount} takes</span>
    </output>
  );
}
