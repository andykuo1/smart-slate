import { useShallow } from 'zustand/react/shallow';

import ShotListInBlockOrder from '@/components/shots/shotlist/ShotListInBlockOrder';
import ShotListInSceneOrder from '@/components/shots/shotlist/ShotListInSceneOrder';
import { useMatchMedia } from '@/libs/UseMatchMedia';
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
  const smallMedia = useMatchMedia('(max-width: 640px)');
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

  const showSceneLevelShotList = sequenceMode;
  const showBlockLevelShotList = inlineMode || shotOnlyMode;

  const isCollapsed = !shotListMode;
  /*
  if (activeShotId) {
    return <BlockEntryFocused documentId={documentId} />;
  }
  */
  return (
    <div ref={containerRef} className={'flex flex-row' + ' ' + className}>
      <div className="flex flex-1 flex-col">
        {blockIds.map((blockId) => (
          <BlockEntry
            key={`block-${blockId}`}
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            mode={blockViewMode}>
            <ShotListInBlockOrder
              className="max-w-[100vw] flex-1"
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              editable={true}
              collapsed={isCollapsed}
              hidden={!showBlockLevelShotList}
            />
          </BlockEntry>
        ))}
      </div>
      <ShotListInSceneOrder
        className="max-w-[50vw] flex-1"
        documentId={documentId}
        sceneId={sceneId}
        collapsed={smallMedia || isCollapsed}
        hidden={!showSceneLevelShotList}
      />
    </div>
  );
}
