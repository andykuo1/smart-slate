import TakeEntryDetailsNew from './TakeEntryDetailsNew';
import TakeEntryHeaderNew from './TakeEntryHeaderNew';
import TakeEntryLayout from './TakeEntryLayout';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {'list'|'inline'} props.viewMode
 */
export default function TakeEntryNew({
  documentId,
  sceneId,
  blockId,
  shotId,
  viewMode,
}) {
  return (
    <TakeEntryLayout viewMode={viewMode}>
      <TakeEntryHeaderNew
        className="bg-gray-200 text-gray-400"
        documentId={documentId}
        sceneId={sceneId}
        shotId={shotId}
        viewMode={viewMode}
      />
      <TakeEntryDetailsNew
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
        shotId={shotId}
        viewMode={viewMode}
      />
    </TakeEntryLayout>
  );
}
