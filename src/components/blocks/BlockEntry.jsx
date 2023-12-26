import { getBlockById, useDocumentStore } from '@/stores/document';

import ShotList from '../shots/ShotList';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function BlockEntry({ documentId, sceneId, blockId }) {
  const content = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.content,
  );
  return (
    <>
      <p className="p-2">{content || 'No Text'}</p>
      <fieldset>
        <ShotList documentId={documentId} sceneId={sceneId} blockId={blockId} />
      </fieldset>
    </>
  );
}
