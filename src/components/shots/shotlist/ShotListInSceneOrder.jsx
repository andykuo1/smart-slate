import { useBlockIds } from '@/stores/document';
import { useSceneShotCount } from '@/stores/document/use';

import ShotListLayout from './ShotListLayout';
import ShotListShots from './ShotListShots';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 * @param {boolean} [props.hidden]
 */
export default function ShotListInSceneOrder({
  className,
  documentId,
  sceneId,
  editable = true,
  collapsed = false,
  hidden = false,
}) {
  const blockIds = useBlockIds(documentId, sceneId);
  const shotCount = useSceneShotCount(documentId, sceneId);
  return (
    <ShotListLayout
      className={className}
      documentId={documentId}
      sceneId={sceneId}
      blockId={blockIds.at(-1) || ''}
      shotCount={shotCount}
      editable={editable}
      collapsed={collapsed}
      hidden={hidden}
      showNew={editable}
      hideHeaderOnEmpty={false}>
      {blockIds.map((blockId) => (
        <ShotListShots
          key={`shotlist-${blockId}`}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          editable={editable}
          collapsed={collapsed}
        />
      ))}
    </ShotListLayout>
  );
}
