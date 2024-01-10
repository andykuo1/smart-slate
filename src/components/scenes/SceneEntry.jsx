import BlockList from '../blocks/BlockList';
import SceneEntryHeader from './SceneEntryHeader';
import SceneEntryLayout from './SceneEntryLayout';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneEntry({ className, documentId, sceneId }) {
  return (
    <SceneEntryLayout
      className={className}
      header={<SceneEntryHeader documentId={documentId} sceneId={sceneId} />}>
      <BlockList documentId={documentId} sceneId={sceneId} />
    </SceneEntryLayout>
  );
}
