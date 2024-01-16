import { useBlockIdForShot } from '@/stores/document/use';
import { useCurrentCursor, useUserStore } from '@/stores/user';

import { ShotEntry } from '../shots/ShotEntry';
import TakeList from '../takes/TakeList';
import BlockContent from './BlockContent';
import BlockEntryLayout from './BlockEntryLayout';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function BlockEntryFocused({ documentId }) {
  const { sceneId, shotId } = useCurrentCursor();
  const blockId = useBlockIdForShot(documentId, sceneId, shotId);
  const isStoryMode = useUserStore((ctx) => ctx.editMode === 'story');
  if (!sceneId || !blockId || !shotId) {
    return null;
  }
  return (
    <BlockEntryLayout
      collapsed={isStoryMode}
      content={<BlockContent documentId={documentId} blockId={blockId} />}>
      <ShotEntry
        className="flex-1"
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
        shotId={shotId}
        collapsed={isStoryMode}>
        <TakeList
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotId={shotId}
          viewMode="list"
        />
      </ShotEntry>
    </BlockEntryLayout>
  );
}
