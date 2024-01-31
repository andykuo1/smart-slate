import { useShallow } from 'zustand/react/shallow';

import { getBlockIdsInOrder } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentCursor, useUserStore } from '@/stores/user';

import SceneShotList from '../shots/SceneShotList';
import ShotList from '../shots/ShotList';
import BlockEntry from './BlockEntry';
import BlockEntryFocused from './BlockEntryFocused';

/*
# Different Modes 
- Inline
- Sequence
- Detailed (only ever forced; can be forced open/close text)
- Auto? (small:inline, med:seq)
 */

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

  const inlineMode = useUserStore((ctx) => ctx.editMode === 'inline');
  const sequenceMode = useUserStore((ctx) => ctx.editMode === 'sequence');
  const shotListMode = useUserStore((ctx) => ctx.shotListMode === 'detail');

  const showSceneLevelShotList = sequenceMode;
  const showBlockLevelShotList = inlineMode || shotListMode;

  const isCollapsed = !shotListMode && !hasActiveShot;
  const { shotId } = useCurrentCursor();
  if (shotId) {
    return <BlockEntryFocused documentId={documentId} />;
  }
  return (
    <div className="flex flex-row">
      <div className="flex-1 flex flex-col">
        {blockIds.map((blockId, index) => (
          <BlockEntry
            key={`block-${blockId}`}
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            mode={
              shotListMode || hasActiveShot
                ? 'faded'
                : sequenceMode
                  ? 'split'
                  : inlineMode
                    ? 'fullwidth'
                    : 'fullwidth'
            }>
            {showBlockLevelShotList && (
              <ShotList
                className="flex-1"
                documentId={documentId}
                sceneId={sceneId}
                blockId={blockId}
                editable={!hasActiveShot}
                collapsed={isCollapsed}
              />
            )}
          </BlockEntry>
        ))}
      </div>
      {showSceneLevelShotList && (
        <SceneShotList
          className="flex-1"
          documentId={documentId}
          sceneId={sceneId}
        />
      )}
    </div>
  );
}
