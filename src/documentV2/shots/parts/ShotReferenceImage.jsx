import { getShotById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { MAX_THUMBNAIL_HEIGHT } from '@/values/Resolutions';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('react').ReactNode} props.placeholder
 */
export default function ShotReferenceImage({
  documentId,
  shotId,
  placeholder,
}) {
  const src = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.referenceImage,
  );
  const offsetX = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.referenceOffsetX,
  );
  const offsetY = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.referenceOffsetY,
  );
  const margin = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.referenceMargin,
  );
  const scale = `${1 + margin / MAX_THUMBNAIL_HEIGHT}`;
  const translate = `${Math.trunc(offsetX)}% ${Math.trunc(offsetY)}%`;

  if (!src) {
    return placeholder;
  }
  return (
    <img
      className="aspect-video w-full"
      style={{
        // NOTE: AT LEAST don't crop anything by default, but also stretch as big as possible
        objectFit: 'contain',
        translate,
        scale,
      }}
      src={src}
    />
  );
}
