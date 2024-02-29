import { getShotTypeIcon } from '@/components/shots/options/ShotTypeIcon';
import { getShotById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import ShadowStyle from '@/styles/Shadow.module.css';
import { MAX_THUMBNAIL_HEIGHT } from '@/values/Resolutions';

import ShotInBlock from '../ShotInBlock';
import ShotInCell from '../ShotInCell';
import ShotInLine from '../ShotInLine';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLLIElement|null>} [props.containerRef]
 * @param {import('react').MutableRefObject<HTMLDivElement|null>} [props.handleRef]
 * @param {string} [props.handleClassName]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {'cell'|'line'|'block'} props.type
 * @param {boolean} props.active
 * @param {boolean} props.editable
 */
export function Shot({
  className,
  containerRef,
  handleRef,
  handleClassName,
  documentId,
  sceneId,
  shotId,
  type,
  active,
  editable,
}) {
  return (
    <li ref={containerRef} className={className}>
      {type === 'cell' ? (
        <ShotInCell
          handleRef={handleRef}
          handleClassName={handleClassName}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          active={active}
          editable={editable}
        />
      ) : type === 'block' ? (
        <ShotInBlock
          handleRef={handleRef}
          handleClassName={handleClassName}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          active={active}
          editable={editable}
        />
      ) : (
        <ShotInLine
          handleRef={handleRef}
          handleClassName={handleClassName}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          active={active}
          editable={editable}
        />
      )}
    </li>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.outlineClassName]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} [props.clipped]
 * @param {import('react').ReactNode} [props.placeholder]
 * @param {import('react').ReactNode} [props.children]
 */
export function ShotThumbnail({
  className,
  outlineClassName,
  documentId,
  shotId,
  placeholder,
  clipped,
  children,
}) {
  return (
    <div
      className={
        'pointer-events-none relative aspect-video w-full overflow-hidden' +
        ' ' +
        className
      }>
      {/* Reference image */}
      <div
        className="overflow-hidden bg-white"
        style={
          clipped
            ? {
                /** NOTE: Since the outline box is 100% - 25% WIDTH, then 12.5% is half that. */
                clipPath: 'inset(12.5% 12.5% 12.5% 12.5%)',
              }
            : {}
        }>
        <ShotReferenceImage
          documentId={documentId}
          shotId={shotId}
          placeholder={placeholder}
        />
      </div>
      {/* Outline */}
      <LetterboxOutline className={outlineClassName} width="calc(100% - 25%)" />
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
 * @param {import('react').ReactNode} props.placeholder
 */
export function ShotReferenceImage({ documentId, shotId, placeholder }) {
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

/**
 * @param {object} props
 * @param {string} props.shotType
 */
export function ShotReferenceImagePlaceholder({ shotType }) {
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
        placeholder={<ShotReferenceImagePlaceholder shotType={shotType} />}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.width
 */
export function LetterboxOutline({ className, width }) {
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
      }
    />
  );
}
