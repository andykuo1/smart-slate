import { useState } from 'react';

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
  const [blockEditable, setBlockEditable] = useState(false);
  const blockId = useBlockIdForShot(documentId, sceneId, shotId);
  const inlineMode = useUserStore((ctx) => ctx.editMode === 'inline');
  const sequenceMode = useUserStore((ctx) => ctx.editMode === 'sequence');
  const shotListMode = useUserStore((ctx) => ctx.shotListMode === 'detail');
  if (!sceneId || !blockId || !shotId) {
    return null;
  }
  return (
    <BlockEntryLayout
      mode={
        shotListMode
          ? 'faded'
          : sequenceMode
            ? 'split'
            : inlineMode
              ? 'fullwidth'
              : 'fullwidth'
      }
      content={
        <BlockContent
          documentId={documentId}
          blockId={blockId}
          editable={blockEditable}
          setEditable={setBlockEditable}
        />
      }>
      <ShotEntry
        className="flex-1"
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
        shotId={shotId}
        collapsed={!shotListMode}>
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
