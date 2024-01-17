import AddBoxIcon from '@material-symbols/svg-400/rounded/add_box.svg';

import { useBlockShotCount } from '@/stores/document/use';
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
  const hasActiveShot = useUserStore((ctx) => Boolean(ctx.cursor?.shotId));
  const blockShotCount = useBlockShotCount(documentId, blockId);
  if (!collapsed && blockShotCount <= 0) {
    return null;
  }

  function onClick() {}

  return (
    <BlockEntryLayout
      collapsed={collapsed}
      content={
        <BlockContent
          className="relative px-4"
          documentId={documentId}
          blockId={blockId}
          editable={true /* TODO: false when ready to add shotlists :) */}>
          <button
            className="hidden group absolute -bottom-3 left-0 right-0 z-10 flex-row items-center"
            onClick={onClick}>
            <AddBoxIcon className="w-6 h-6 fill-current opacity-10 group-hover:opacity-100" />
            <hr className="flex-1 border-t-4 border-spacing-2 border-black border-dashed opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </BlockContent>
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
