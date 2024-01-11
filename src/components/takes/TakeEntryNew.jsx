import TakeEntryDetails from './TakeEntryDetails';
import TakeEntryHeaderNew from './TakeEntryHeaderNew';
import TakeEntryLayout from './TakeEntryLayout';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {'list'|'inline'} props.viewMode
 */
export default function TakeEntryNew({
  documentId,
  sceneId,
  shotId,
  viewMode,
}) {
  return (
    <TakeEntryLayout viewMode={viewMode}>
      <TakeEntryHeaderNew
        className="text-gray-400"
        documentId={documentId}
        sceneId={sceneId}
        shotId={shotId}
        viewMode={viewMode}
      />
      <TakeEntryDetails documentId={documentId} takeId="" viewMode={viewMode} />
    </TakeEntryLayout>
  );
}
