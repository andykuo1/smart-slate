import { getShotById, useDocumentStore } from '@/stores/document';

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function ClapperShotHashField({
  className,
  documentId,
  shotId,
}) {
  const shotHash = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.shotHash,
  );
  return <div className={className}>{shotHash || '----'}</div>;
}
