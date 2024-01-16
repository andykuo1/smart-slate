import { getShotById, useDocumentStore } from '@/stores/document';

import { formatShotType } from '../takes/TakeNameFormat';

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function ClapperShotTypeField({
  className,
  documentId,
  shotId,
}) {
  const shotType = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.shotType,
  );
  const formattedShotType = formatShotType(shotType);
  return <div className={className}>{formattedShotType || '--'}</div>;
}
