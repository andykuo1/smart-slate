import { useState } from 'react';

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
 * @param {'faded'|'split'|'fullwidth'} [props.mode]
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
  if (mode === 'faded' && blockShotCount <= 0) {
    return null;
  }

  return (
    <BlockEntryLayout
      documentId={documentId}
      sceneId={sceneId}
      className={className}
      mode={mode}
      content={
        <div className="group w-full h-full flex hover:bg-gray-100">
          <BlockContent
            className={
              'flex-1 p-2 px-4' + ' ' + (blockEditable ? 'min-h-[20vh]' : '')
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
      }>
      {children}
    </BlockEntryLayout>
  );
}
