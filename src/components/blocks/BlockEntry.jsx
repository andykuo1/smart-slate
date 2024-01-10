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
  return (
    <BlockEntryLayout
      collapsed={collapsed}
      content={
        <BlockContent
          documentId={documentId}
          blockId={blockId}
          editable={editable}
        />
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
