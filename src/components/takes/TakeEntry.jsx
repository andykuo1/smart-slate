import TakeEntryDetails from './TakeEntryDetails';
import TakeEntryHeader from './TakeEntryHeader';
import TakeEntryLayout from './TakeEntryLayout';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {'list'|'inline'} props.viewMode
 */
export default function TakeEntry({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
  takeId,
  viewMode,
}) {
  return (
    <TakeEntryLayout className={className} viewMode={viewMode}>
      <TakeEntryHeader
        documentId={documentId}
        sceneId={sceneId}
        shotId={shotId}
        takeId={takeId}
        viewMode={viewMode}
      />
      <TakeEntryDetails
        documentId={documentId}
        takeId={takeId}
        viewMode={viewMode}
      />
    </TakeEntryLayout>
  );
}
