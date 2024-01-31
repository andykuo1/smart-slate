import { useState } from 'react';

import { useBlockIdForShot } from '@/stores/document/use';
import { useCurrentCursor } from '@/stores/user';

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
  if (!sceneId || !blockId || !shotId) {
    return null;
  }
  return (
    <BlockEntryLayout
      mode="faded"
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
        collapsed={false}>
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
