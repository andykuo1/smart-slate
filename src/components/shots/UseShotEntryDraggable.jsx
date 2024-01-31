import { useCallback } from 'react';

import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {import('react').RefObject<HTMLElement>} targetRef
 */
export function useShotEntryOnDragUpdate(targetRef) {
  /** @type {import('@/stores/draggable').OnDragUpdateCallback} */
  const onDragUpdate = useCallback(
    function _onDragUpdate(targetId, overId, x, y) {
      let target = targetRef.current;
      if (!target) {
        return;
      }
      target.style.left = `${x}px`;
      target.style.top = `${y}px`;
      target.style.translate = '-25% -50%';
    },
    [targetRef],
  );
  return onDragUpdate;
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function useShotEntryOnDragComplete(documentId) {
  const moveShotToBlock = useDocumentStore((ctx) => ctx.moveShotToBlock);

  /** @type {import('@/stores/draggable').OnDragCompleteCallback} */
  const onDragComplete = useCallback(
    function _onDragComplete(
      targetContainerId,
      targetId,
      overContainerId,
      overId,
      x,
      y,
    ) {
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
      moveShotToBlock(
        documentId,
        targetContainerId,
        targetId,
        overContainerId,
        overId,
        isBefore,
      );
    },
    [documentId, moveShotToBlock],
  );
  return onDragComplete;
}
