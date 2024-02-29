import LetterboxOutline from './LetterboxOutline';
import ShotReferenceImage from './ShotReferenceImage';

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
export default function ShotThumbnail({
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
