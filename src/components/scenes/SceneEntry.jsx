import { useShallow } from 'zustand/react/shallow';

import { getBlockIdsInOrder, useDocumentStore } from '@/stores/document';
import { useCurrentCursor } from '@/stores/user';

import BlockEntry from '../blocks/BlockEntry';
import SceneHeading from './SceneHeading';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneEntry({ documentId, sceneId }) {
  const userCursor = useCurrentCursor();
  const activeShotId = userCursor.shotId;
  const activeSceneId = userCursor.sceneId;
  const hasActiveShot = Boolean(activeShotId);
  const blockIds = useDocumentStore(
    useShallow((ctx) => getBlockIdsInOrder(ctx, documentId, sceneId)),
  );

  if (hasActiveShot && activeSceneId !== sceneId) {
    return null;
  }
  return (
    <section className="flex flex-col mt-10">
      <SceneHeading documentId={documentId} sceneId={sceneId} />
      {blockIds.map((blockId) => (
        <BlockEntry
          key={`block-${blockId}`}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
        />
      ))}
    </section>
  );
}
