import { Fragment } from 'react';

import { ShotEntry } from '@/components/shots/ShotEntry';
import TakeList from '@/components/takes/TakeList';
import { useShotIds } from '@/stores/document';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 * @param {boolean} [props.showTakes]
 */
export default function ShotListShots({
  documentId,
  sceneId,
  blockId,
  editable = true,
  collapsed = false,
  showTakes = false,
}) {
  const shotIds = useShotIds(documentId, blockId);
  return (
    <>
      {shotIds.map((shotId) => (
        <Fragment key={`shot-${shotId}`}>
          <ShotEntry
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            shotId={shotId}
            editable={editable}
            collapsed={collapsed}>
            {showTakes && (
              <TakeList
                documentId={documentId}
                sceneId={sceneId}
                blockId={blockId}
                shotId={shotId}
                viewMode={collapsed ? 'list' : 'inline'}
              />
            )}
          </ShotEntry>
        </Fragment>
      ))}
    </>
  );
}
