import { useShallow } from 'zustand/react/shallow';

import { getBlockIdsInOrder, useDocumentStore } from '@/stores/document';
import { useUserStore } from '@/stores/user';

import BlockEntry from './BlockEntry';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function BlockList({ documentId, sceneId }) {
  const blockIds = useDocumentStore(
    useShallow((ctx) => getBlockIdsInOrder(ctx, documentId, sceneId)),
  );
  const hasActiveShot = useUserStore((ctx) => Boolean(ctx.cursor?.shotId));
  const isShotListMode = useUserStore((ctx) => ctx.editMode === 'shotlist');
  const isCollapsed = !isShotListMode && !hasActiveShot;
  return (
    <>
      {blockIds.map((blockId) => (
        <BlockEntry
          key={`block-${blockId}`}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          collapsed={isCollapsed}
        />
      ))}
    </>
  );
}
