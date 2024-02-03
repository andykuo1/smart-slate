import { useState } from 'react';

import AddBoxIcon from '@material-symbols/svg-400/rounded/add_box.svg';
import EditDocumentIcon from '@material-symbols/svg-400/rounded/edit_note.svg';

import { createShot } from '@/stores/document/DocumentStore';
import { useBlockShotCount, useDocumentStore } from '@/stores/document/use';

import SettingsFieldButton from '../settings/SettingsFieldButton';
import BlockContent from './BlockContent';
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
  const addShot = useDocumentStore((ctx) => ctx.addShot);
  const blockShotCount = useBlockShotCount(documentId, blockId);
  if (mode === 'faded' && blockShotCount <= 0) {
    return null;
  }

  function onClick() {
    let shot = createShot();
    addShot(documentId, sceneId, blockId, shot);
  }

  function onEditClick() {
    setBlockEditable((prev) => !prev);
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
          <div className="absolute top-0 right-0 z-10 p-1 flex flex-col rounded group-hover:bg-opacity-60 group-hover:bg-white">
            <SettingsFieldButton
              className="opacity-0 p-0 group-hover:opacity-100"
              Icon={EditDocumentIcon}
              onClick={onEditClick}
            />
            <SettingsFieldButton
              className="opacity-0 p-0 group-hover:opacity-100"
              Icon={AddBoxIcon}
              onClick={onClick}
            />
          </div>
        </div>
      }>
      {children}
    </BlockEntryLayout>
  );
}
