import { useState } from 'react';

import { getBlockFocusId } from '@/scrollfocus/BlockFocus';
import { useBlockShotCount } from '@/stores/document/use';

import BlockContent from './BlockContent';
import BlockContentToolbar from './BlockContentToolbar';
import BlockEntryLayout from './BlockEntryLayout';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {'faded'|'split'|'fullwidth'|'solowidth'|'childonly'} [props.mode]
 * @param {import('react').ReactNode} props.children
 */
export default function BlockEntry({
  className,
  documentId,
  sceneId,
  blockId,
  editable = true,
  mode = 'fullwidth',
  children,
}) {
  const [blockEditable, setBlockEditable] = useState(false);
  const blockShotCount = useBlockShotCount(documentId, blockId);
  const hasAnyShots = blockShotCount > 0;
  if (mode === 'faded' && !hasAnyShots) {
    return null;
  }

  return (
    <BlockEntryLayout
      documentId={documentId}
      sceneId={sceneId}
      className={className}
      mode={mode}
      content={
        mode !== 'childonly' && (
          <div
            id={getBlockFocusId(blockId)}
            className={
              'group flex h-full w-full' +
              ' ' +
              (blockEditable
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800')
            }>
            <BlockContent
              className={
                'mx-4 flex-1 pb-4' + ' ' + (blockEditable ? 'min-h-[20vh]' : '')
              }
              documentId={documentId}
              blockId={blockId}
              editable={editable && blockEditable}
              setEditable={setBlockEditable}
            />
            <BlockContentToolbar
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              setEditable={setBlockEditable}
            />
          </div>
        )
      }>
      {mode !== 'solowidth' && children}
    </BlockEntryLayout>
  );
}
