import { Fragment, useCallback } from 'react';

import { useDraggableContainer, useDraggableDispatch } from '@/libs/draggable';
import { useDocumentStore, useShotIds } from '@/stores/document';
import { moveShot } from '@/stores/document/dispatch/DispatchShots';
import { useCurrentCursor } from '@/stores/user';

import TakeList from '../takes/TakeList';
import GridStyle from './GridStyle.module.css';
import NewShotEntry from './NewShotEntry';
import { ShotEntry } from './ShotEntry';
import ShotEntryDragged from './ShotEntryDragged';

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
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const { UNSAFE_getDraggableStore } = useDraggableDispatch();

  /** @type {import('@/libs/draggable').OnDragCompleteCallback} */
  const onDragComplete = useCallback(
    function _onDragComplete(targetId, overId, x, y) {
      if (targetId === overId) {
        return;
      }
      let isBefore = false;
      if (!overId) {
        const refs = UNSAFE_getDraggableStore().elementRefs;
        const targetX = x;
        const targetY = y;
        let nearestId = null;
        let nearestBefore = false;
        let nearestDistSqu = Number.POSITIVE_INFINITY;

        // Get nearest over id
        for (let [id, ref] of Object.entries(refs)) {
          const element = ref?.current;
          if (!element) {
            continue;
          }
          const elementRect = element.getBoundingClientRect();
          const dx = targetX - (elementRect.x + elementRect.width / 2);
          const dy = targetY - (elementRect.y + elementRect.height / 2);
          const elementBefore = dx < 0;
          const distSqu = dx * dx + dy * dy;
          if (distSqu < nearestDistSqu) {
            nearestId = id;
            nearestBefore = elementBefore;
            nearestDistSqu = distSqu;
          }
        }
        if (!nearestId) {
          return;
        }
        overId = nearestId;
      } else {
        const refs = UNSAFE_getDraggableStore().elementRefs;
        const overElement = refs[overId]?.current;
        if (overElement) {
          const overRect = overElement.getBoundingClientRect();
          const overX = overRect.x + overRect.width / 2;
          isBefore = x < overX;
        }
      }
      const store = UNSAFE_getStore();
      moveShot(store, documentId, blockId, targetId, overId, isBefore);
    },
    [UNSAFE_getDraggableStore, UNSAFE_getStore, documentId, blockId],
  );

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
        <NewShotEntry documentId={documentId} blockId={blockId} />
      )}
      <ShotEntryDragged
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
      />
    </ul>
  );
}
