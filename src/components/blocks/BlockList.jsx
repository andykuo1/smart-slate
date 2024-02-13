import { useShallow } from 'zustand/react/shallow';

import ShotListInBlockOrder from '@/components/shots/shotlist/ShotListInBlockOrder';
import { getBlockIdsInOrder } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useUserStore } from '@/stores/user';

import BlockEntry from './BlockEntry';

/*
# Different Modes 
- Inline
- Sequence
- Detailed (only ever forced; can be forced open/close text)
- Auto? (small:inline, med:seq)
 */

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLDivElement|null>} [props.containerRef]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function BlockList({
  className,
  containerRef,
  documentId,
  sceneId,
}) {
  const blockIds = useDocumentStore(
    useShallow((ctx) => getBlockIdsInOrder(ctx, documentId, sceneId)),
  );
  const inlineMode = useUserStore((ctx) => ctx.editMode === 'inline');
  const sequenceMode = useUserStore((ctx) => ctx.editMode === 'sequence');
  const textOnlyMode = useUserStore((ctx) => ctx.editMode === 'textonly');
  const shotOnlyMode = useUserStore((ctx) => ctx.editMode === 'shotonly');
  const shotListMode = useUserStore((ctx) => ctx.shotListMode === 'detail');
  const blockViewMode = textOnlyMode
    ? 'solowidth'
    : shotOnlyMode
      ? 'childonly'
      : sequenceMode
        ? 'split'
        : inlineMode
          ? 'fullwidth'
          : 'fullwidth';
  const showBlockLevelShotList = inlineMode;
  const isCollapsed = !shotListMode;

  return (
    <div ref={containerRef} className={'flex flex-col' + ' ' + className}>
      {blockIds.map((blockId, index, array) => (
        <BlockEntry
          key={`block-${blockId}`}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          mode={blockViewMode}>
          <ShotListInBlockOrder
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            editable={true}
            collapsed={isCollapsed}
            hidden={!showBlockLevelShotList}
            isLastBlock={index >= array.length - 1}
          />
        </BlockEntry>
      ))}
    </div>
  );
}
