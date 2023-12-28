import ShotList from '../shots/ShotList';
import BlockContent from './BlockContent';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 */
export default function BlockEntry({
  documentId,
  sceneId,
  blockId,
  editable = true,
}) {
  return (
    <div>
      <BlockContent
        documentId={documentId}
        blockId={blockId}
        editable={editable}
      />
      <fieldset>
        <legend className="hidden">Shot list</legend>
        <ShotList
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          editable={editable}
        />
      </fieldset>
    </div>
  );
}
