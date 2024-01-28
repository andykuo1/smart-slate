import { useState } from 'react';

import AddBoxIcon from '@material-symbols/svg-400/rounded/add_box.svg';
import EditDocumentIcon from '@material-symbols/svg-400/rounded/edit_note.svg';

import { createShot } from '@/stores/document/DocumentStore';
import { useBlockShotCount, useDocumentStore } from '@/stores/document/use';
import { useUserStore } from '@/stores/user';

import ShotList from '../shots/ShotList';
import BlockContent from './BlockContent';
import BlockEntryLayout from './BlockEntryLayout';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 */
export default function BlockEntry({
  documentId,
  sceneId,
  blockId,
  editable = true,
  collapsed = false,
}) {
  const [blockEditable, setBlockEditable] = useState(false);
  const addShot = useDocumentStore((ctx) => ctx.addShot);
  const hasActiveShot = useUserStore((ctx) => Boolean(ctx.cursor?.shotId));
  const blockShotCount = useBlockShotCount(documentId, blockId);
  if (!collapsed && blockShotCount <= 0) {
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
      collapsed={collapsed}
      content={
        <div className="group relative px-4 flex w-full md:w-[60vw] h-full">
          <BlockContent
            className="flex-1"
            documentId={documentId}
            blockId={blockId}
            editable={editable && blockEditable}
            setEditable={setBlockEditable}
          />
          <div className="absolute top-0 right-0 z-10 flex flex-col gap-2">
            <button
              className="flex flex-row items-center"
              onClick={onEditClick}>
              <EditDocumentIcon className="w-6 h-6 fill-current opacity-0 group-hover:opacity-100" />
            </button>
            <button className="flex flex-row items-center" onClick={onClick}>
              <AddBoxIcon className="w-6 h-6 fill-current opacity-0 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      }>
      <ShotList
        className="flex-1"
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
        editable={editable && !hasActiveShot}
        collapsed={collapsed}
      />
    </BlockEntryLayout>
  );
}
