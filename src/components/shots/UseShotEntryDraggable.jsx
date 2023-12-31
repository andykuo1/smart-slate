import { useCallback } from 'react';

import { useDocumentStore } from '@/stores/document';
import { moveShot } from '@/stores/document/dispatch/DispatchShots';

/**
 * @param {import('react').RefObject<HTMLElement>} targetRef
 */
export function useShotEntryOnDragUpdate(targetRef) {
  /** @type {import('@/stores/draggable').OnDragUpdateCallback} */
  const onDragUpdate = useCallback(function _onDragUpdate(
    targetId,
    overId,
    x,
    y,
  ) {
    let target = targetRef.current;
    if (!target) {
      return;
    }
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    target.style.translate = '-25% -50%';
  }, []);
  return onDragUpdate;
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function useShotEntryOnDragComplete(documentId, blockId) {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);

  /** @type {import('@/stores/draggable').OnDragCompleteCallback} */
  const onDragComplete = useCallback(
    function _onDragComplete(targetId, overId, x, y) {
      if (targetId === overId) {
        return;
      }
      let isBefore = false;
      if (!overId) {
        const draggableElements = document.querySelectorAll('[data-draggable]');
        const targetX = x;
        const targetY = y;
        let nearestId = null;
        let nearestBefore = false;
        let nearestDistSqu = Number.POSITIVE_INFINITY;

        // Get nearest over id
        for (let element of draggableElements) {
          if (!element) {
            continue;
          }
          const id = element.getAttribute('data-draggable');
          if (!id) {
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
        isBefore = nearestBefore;
      } else {
        const overElement = document.querySelector(
          `[data-draggable="${overId}"]`,
        );
        if (overElement) {
          const overRect = overElement.getBoundingClientRect();
          const overX = overRect.x + overRect.width / 2;
          isBefore = x < overX;
        }
      }
      const store = UNSAFE_getStore();
      moveShot(store, documentId, blockId, targetId, overId, isBefore);
    },
    [UNSAFE_getStore, documentId, blockId],
  );
  return onDragComplete;
}
