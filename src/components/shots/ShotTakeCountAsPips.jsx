import { useShotTakeCount } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function ShotTakeCountAsPips({ documentId, shotId }) {
  const takeCount = useShotTakeCount(documentId, shotId);
  if (takeCount <= 0) {
    return null;
  }
  return (
    <div
      className={
        'absolute -bottom-2 -left-2 z-10 text-xs px-1 rounded bg-white text-black'
      }>
      {'■'.repeat(Math.min(takeCount, 3))}
      {takeCount > 3 ? '...' : ''}
    </div>
  );
}
