import ShotReferenceImage from './ShotReferenceImage';
import ShotReferenceImagePlaceholder from './ShotReferenceImagePlaceholder';

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {string} props.shotType
 * @param {boolean} props.letterbox
 */
export default function ShotReferenceImageWithLetterbox({
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
