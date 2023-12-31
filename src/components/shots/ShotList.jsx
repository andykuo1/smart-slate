import { Fragment } from 'react';

import { useShotIds } from '@/stores/document';
import { useDraggableContainer } from '@/stores/draggable';
import { useCurrentCursor } from '@/stores/user';

import TakeList from '../takes/TakeList';
import GridStyle from './GridStyle.module.css';
import { ShotEntry } from './ShotEntry';
import ShotEntryDragged from './ShotEntryDragged';
import ShotEntryNew from './ShotEntryNew';
import { useShotEntryOnDragComplete } from './UseShotEntryDraggable';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 */
export default function ShotList({
  documentId,
  sceneId,
  blockId,
  editable = true,
  collapsed = false,
}) {
  const userCursor = useCurrentCursor();
  const activeShotId = userCursor.shotId;
  const hasActiveShot = Boolean(activeShotId);
  const shotIds = useShotIds(documentId, blockId);
  const onDragComplete = useShotEntryOnDragComplete(documentId, blockId);
  useDraggableContainer(onDragComplete);

  return (
    <ul title="Shot list">
      <div className={collapsed ? GridStyle.grid : ''}>
        {shotIds.map(
          (shotId) =>
            (!hasActiveShot || shotId === activeShotId) && (
              <Fragment key={`shot-${shotId}`}>
                <ShotEntry
                  documentId={documentId}
                  sceneId={sceneId}
                  blockId={blockId}
                  shotId={shotId}
                  collapsed={collapsed}>
                  <TakeList
                    documentId={documentId}
                    sceneId={sceneId}
                    blockId={blockId}
                    shotId={shotId}
                    viewMode={hasActiveShot ? 'list' : 'inline'}
                  />
                </ShotEntry>
              </Fragment>
            ),
        )}
      </div>
      {editable && !hasActiveShot && (
        <ShotEntryNew documentId={documentId} blockId={blockId} />
      )}
      <ShotEntryDragged
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
      />
    </ul>
  );
}
