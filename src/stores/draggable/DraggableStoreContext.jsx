import { useEffect, useRef } from 'react';
import { useCallback } from 'react';

import { useAnimationFrame } from '@/libs/animationframe';

import { useDraggableStore } from './UseDraggableStore';

/**
 * @callback OnDragUpdateCallback
 * @param {string} targetId
 * @param {string} overId
 * @param {number} x
 * @param {number} y
 */

/**
 * @callback OnDragCompleteCallback
 * @param {string} targetId
 * @param {string} overId
 * @param {number} x
 * @param {number} y
 */

export const DRAG_START_BUFFER_RADIUS = 50;
export const DRAG_START_BUFFER_RADIUS_SQUARED =
  DRAG_START_BUFFER_RADIUS * DRAG_START_BUFFER_RADIUS;

export const DRAG_AUTOSCROLL_SPEED = 5;

/**
 * @param {string} targetId
 */
export function useIsDragging(targetId) {
  return useDraggableStore(
    (state) => state.dragging && state.dragTargetId === targetId,
  );
}

export function useIsAnyDragging() {
  return useDraggableStore((state) => state.dragging);
}

/**
 * @param {string} targetId
 */
export function useIsDraggingOver(targetId) {
  return useDraggableStore(
    (state) => state.dragging && state.dragOverTargetId === targetId,
  );
}

export function useDraggableTarget() {
  return useDraggableStore((state) => state.dragTargetId);
}

/**
 * @param {string} targetId
 * @param {import('react').RefObject<HTMLElement|null>} elementRef
 */
export function useDraggable(targetId, elementRef) {
  const { tryStartDrag, tryMoveDragEnter, tryMoveDragLeave } =
    useDraggableStore();

  /** @type {import('react').TouchEventHandler} */
  function onTouchStart(e) {
    let touch = e.touches[0];
    if (!touch) {
      return;
    }
    tryStartDrag(targetId, touch.clientX, touch.clientY);
  }

  /** @type {import('react').MouseEventHandler} */
  function onMouseDown(e) {
    tryStartDrag(targetId, e.clientX, e.clientY);
  }

  /** @type {import('react').MouseEventHandler} */
  function onMouseEnter(e) {
    tryMoveDragEnter(targetId, e.clientX, e.clientY);
  }

  /** @type {import('react').MouseEventHandler} */
  function onMouseLeave(e) {
    tryMoveDragLeave(targetId, e.clientX, e.clientY);
  }

  return {
    onMouseEnter: useCallback(onMouseEnter, [targetId, tryMoveDragEnter]),
    onMouseLeave: useCallback(onMouseLeave, [targetId, tryMoveDragLeave]),
    handleProps: {
      'data-draggable': targetId,
      onTouchStart: useCallback(onTouchStart, [targetId, tryStartDrag]),
      onMouseDown: useCallback(onMouseDown, [targetId, tryStartDrag]),
    },
  };
}

/**
 * @param {(targetId: string, overId: string, x: number, y: number) => void} onDragUpdate
 */
export function useDraggableCursor(onDragUpdate) {
  const { UNSAFE_getDraggableStore } = useDraggableStore();

  const animationCallback = useCallback(
    /** @param {number} now */
    function onAnimationFrame(now) {
      const state = UNSAFE_getDraggableStore();
      onDragUpdate(
        state.dragTargetId,
        state.dragOverTargetId,
        state.dragMove[0],
        state.dragMove[1],
      );
    },
    [onDragUpdate, UNSAFE_getDraggableStore],
  );
  useAnimationFrame(animationCallback);
}

/**
 * @param {(targetId: string, overId: string, x: number, y: number) => void} onDragComplete
 */
export function useDraggableContainer(onDragComplete) {
  const { tryMoveDrag, tryStopDrag, UNSAFE_getDraggableStore } =
    useDraggableStore();

  const touchMoveCallback = useCallback(
    /** @param {TouchEvent} e */
    function onTouchMove(e) {
      const touch = e.touches[0];
      if (!touch) {
        return;
      }
      tryMoveDrag(touch.clientX, touch.clientY);
      if (UNSAFE_getDraggableStore().dragTargetId) {
        e.preventDefault();
      }
    },
    [tryMoveDrag],
  );

  const touchEndCallback = useCallback(
    /** @param {TouchEvent} e */
    function onTouchEnd(e) {
      const touch = e.changedTouches[0];
      if (!touch) {
        return;
      }
      tryStopDrag(touch.clientX, touch.clientY, onDragComplete);
    },
    [tryStopDrag, onDragComplete],
  );

  const moveCallback = useCallback(
    /** @param {MouseEvent} e */
    function onMouseMove(e) {
      tryMoveDrag(e.clientX, e.clientY);
    },
    [tryMoveDrag],
  );

  const upCallback = useCallback(
    /** @param {MouseEvent} e */
    function onMouseUp(e) {
      tryStopDrag(e.clientX, e.clientY, onDragComplete);
    },
    [tryStopDrag, onDragComplete],
  );

  useEffect(() => {
    /** @type {AddEventListenerOptions} */
    let touchMoveOptions = { passive: false };
    document.addEventListener('touchmove', touchMoveCallback, touchMoveOptions);
    document.addEventListener('touchend', touchEndCallback);
    document.addEventListener('mousemove', moveCallback);
    document.addEventListener('mouseup', upCallback);
    return () => {
      document.removeEventListener(
        'touchmove',
        touchMoveCallback,
        touchMoveOptions,
      );
      document.removeEventListener('touchend', touchEndCallback);
      document.removeEventListener('mousemove', moveCallback);
      document.removeEventListener('mouseup', upCallback);
    };
  }, [touchMoveCallback, touchEndCallback, moveCallback, upCallback]);
}

const FRAME_DELTA_FACTOR = 10;
const MAX_FRAME_DELTA = 10;

/**
 * @param {import('react').RefObject<HTMLElement>} scrollContainerRef
 * @param {number} [scrollSpeedX]
 * @param {number} [scrollSpeedY]
 */
export function useDraggableContainerAutoScroll(
  scrollContainerRef,
  scrollSpeedX = 1,
  scrollSpeedY = 1,
) {
  const { tryAutoScroll } = useDraggableStore();
  const prevFrameRef = useRef(0);
  const animationCallback = useCallback(
    /** @param {number} now */
    function onAnimationFrame(now) {
      // Calculate frame speed.
      const prev = prevFrameRef.current;
      prevFrameRef.current = now;
      const dt = Math.min((now - prev) / FRAME_DELTA_FACTOR, MAX_FRAME_DELTA);
      // Auto-scroll the container when near edge.
      let scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        tryAutoScroll(scrollContainer, scrollSpeedX * dt, scrollSpeedY * dt);
      }
    },
    [scrollSpeedX, scrollSpeedY, scrollContainerRef, tryAutoScroll],
  );
  useAnimationFrame(animationCallback);
}
