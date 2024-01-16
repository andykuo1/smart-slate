import { getDocumentById, useDocumentStore } from '@/stores/document';

/**
 *
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @returns
 */
export default function DocumentContentCount({ documentId }) {
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
    <output className="text-xs opacity-30 flex gap-1 mx-auto">
      <span>{sceneCount} scenes</span>
      <span>/</span>
      <span>{shotCount} shots</span>
      <span>/</span>
      <span>{takeCount} takes</span>
    </output>
  );
}