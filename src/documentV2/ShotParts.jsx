import {
  getShotTypeIcon,
  getShotTypeText,
} from '@/components/shots/options/ShotTypeIcon';
import {
  getShotById,
  useShotDescription,
  useShotType,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import ShadowStyle from '@/styles/Shadow.module.css';
import { MAX_THUMBNAIL_HEIGHT } from '@/values/Resolutions';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLLIElement|null>} [props.containerRef]
 * @param {import('react').MutableRefObject<HTMLDivElement|null>} [props.handleRef]
 * @param {string} [props.handleClassName]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} props.small
 * @param {import('react').ReactNode} [props.slotThumbnail]
 * @param {import('react').ReactNode} [props.children]
 */
export function Shot({
  className,
  containerRef,
  handleRef,
  handleClassName,
  documentId,
  shotId,
  small,
  slotThumbnail,
  children,
}) {
  const shotType = useShotType(documentId, shotId);
  return (
    <li
      ref={containerRef}
      className={className ?? 'flex flex-col items-center sm:flex-row'}>
      <div
        className={
          'w-[1.8in]' + ' ' + (small ? 'scale-90' : '') + ' ' + handleClassName
        }
        ref={handleRef}>
        <ShotThumbnail
          className="bg-gray-200 text-gray-400"
          documentId={documentId}
          shotId={shotId}
          shotType={shotType}>
          {slotThumbnail}
        </ShotThumbnail>
      </div>
      {children}
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} props.small
 */
export function ShotPartDetail({ documentId, shotId, small }) {
  // NOTE: 0.9in is just a best guess.
  return (
    <div
      className={
        'flex-1 overflow-x-auto pt-2' +
        ' ' +
        (small ? 'max-h-[0.5in]' : 'sm:h-[0.9in]')
      }>
      <ShotText documentId={documentId} shotId={shotId} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export function ShotText({ documentId, shotId }) {
  const text = useShotDescription(documentId, shotId);
  return <p className="italic">{text}</p>;
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.outlineClassName]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {string} [props.shotType]
 * @param {import('react').ReactNode} [props.children]
 */
export function ShotThumbnail({
  className,
  outlineClassName,
  documentId,
  shotId,
  shotType,
  children,
}) {
  return (
    <div
      className={
        'pointer-events-none relative aspect-video w-full overflow-hidden rounded-xl' +
        ' ' +
        className
      }>
      {/* Reference image */}
      <ShotReferenceImage
        documentId={documentId}
        shotId={shotId}
        shotType={shotType || ''}
      />
      {/* Outline */}
      <LetterboxOutline
        className={outlineClassName}
        width="calc(100% - 25%)"
        shotType={shotType || ''}
      />
      {children}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export function FadedBorder({ className }) {
  return (
    <div
      className={
        'absolute bottom-0 left-0 right-0 top-0 rounded-xl' +
        ' ' +
        ShadowStyle.shadowInner1rem +
        ' ' +
        className
      }
    />
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {string} props.shotType
 */
export function ShotReferenceImage({ documentId, shotId, shotType }) {
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
    return <ShotReferenceImagePlaceholder shotType={shotType} />;
  }

  return (
    <img
      className="aspect-video h-full w-full"
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

/**
 * @param {object} props
 * @param {string} props.shotType
 */
function ShotReferenceImagePlaceholder({ shotType }) {
  const Icon = getShotTypeIcon(shotType);
  return <Icon className="aspect-video h-full w-full fill-current py-[15%]" />;
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {string} props.shotType
 * @param {boolean} props.letterbox
 */
export function ShotReferenceImageWithLetterbox({
  className,
  documentId,
  shotId,
  shotType,
  letterbox,
}) {
  return (
    <div
      className={'h-full w-full' + ' ' + className}
      style={
        letterbox
          ? {
              /** NOTE: Since the outline box is 100% - 25% WIDTH, then 12.5% is half that. */
              clipPath: 'inset(12.5% 12.5% 12.5% 12.5%)',
            }
          : {}
      }>
      <ShotReferenceImage
        documentId={documentId}
        shotId={shotId}
        shotType={shotType}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.width
 * @param {string} props.shotType
 */
export function LetterboxOutline({ className, width, shotType }) {
  return (
    <div
      style={{
        width,
      }}
      className={
        'absolute bottom-0 left-0 right-0 top-0 m-auto outline outline-1 outline-black' +
        ' ' +
        'aspect-video' +
        ' ' +
        ShadowStyle.shadowOutline +
        ' ' +
        className
      }>
      {/* Shot type */}
      <div
        className={
          'absolute right-1 top-0' + ' ' + ShadowStyle.shadowTextOutline
        }>
        {getShotTypeText(shotType)}
      </div>
    </div>
  );
}
