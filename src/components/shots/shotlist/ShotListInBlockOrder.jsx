import { getShotIdsInBlockOrder } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

import ShotListLayout from './ShotListLayout';
import ShotListShots from './ShotListShots';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 * @param {boolean} [props.hidden]
 * @param {boolean} [props.isLastBlock]
 */
export default function ShotListInBlockOrder({
  className,
  documentId,
  sceneId,
  blockId,
  editable = true,
  collapsed = false,
  hidden = false,
  isLastBlock,
}) {
  const shotIds = useShotIdsInBlockOrder(documentId, blockId);
  return (
    <ShotListLayout
      className={className}
      documentId={documentId}
      sceneId={sceneId}
      blockId={blockId}
      shotCount={shotIds.length}
      editable={editable}
      collapsed={collapsed}
      hidden={hidden}
      showNew={editable && (shotIds.length > 0 || isLastBlock)}
      disableLazyLoading={true}>
      <ShotListShots
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
        editable={editable}
        collapsed={collapsed}
      />
    </ShotListLayout>
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
function useShotIdsInBlockOrder(documentId, blockId) {
  return useDocumentStore((ctx) =>
    getShotIdsInBlockOrder(ctx, documentId, blockId),
  );
}
