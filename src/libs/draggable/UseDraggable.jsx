import { useEffect, useRef } from 'react';
import { useCallback } from 'react';

import { shallow } from 'zustand/shallow';

import { useAnimationFrame } from '@/libs/animationframe';
import { slowShallowCopyObjects } from '@/utils/ObjectCopy';

import { useStore } from './DraggableStore';

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

export function useDraggableStore() {
  return useStore(
    (state) => /** @type {import('./DraggableStore').Store} */ (state),
  );
}

export function useDraggableDispatch() {
  return useStore(
    (state) =>
      slowShallowCopyObjects(
        {},
        /** @type {import('./DraggableStore').Dispatch} */ (state),
      ),
    shallow,
  );
}

/**
 * @param {string} targetId
 */
export function useIsDragging(targetId) {
  return useStore((state) => state.dragging && state.dragTargetId === targetId);
}

export function useIsAnyDragging() {
  return useStore((state) => state.dragging);
}

/**
 * @param {string} targetId
 */
export function useIsDraggingOver(targetId) {
  return useStore(
    (state) => state.dragging && state.dragOverTargetId === targetId,
  );
}

export function useDraggableTarget() {
  return useStore((state) => state.dragTargetId);
}

/**
 * @param {string} targetId
 * @param {import('react').RefObject<Element>} elementRef
 */
export function useDraggable(targetId, elementRef) {
  const {
    tryStartDrag,
    tryMoveDragEnter,
    tryMoveDragLeave,
    tryUpdateElementRect,
    tryUpdateElementRef,
  } = useDraggableDispatch();

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

  useEffect(() => {
    tryUpdateElementRef(targetId, elementRef);
    tryUpdateElementRect(targetId);
  }, [targetId, elementRef]);

  return {
    onMouseDown: useCallback(onMouseDown, [targetId, tryStartDrag]),
    onMouseEnter: useCallback(onMouseEnter, [targetId, tryMoveDragEnter]),
    onMouseLeave: useCallback(onMouseLeave, [targetId, tryMoveDragLeave]),
  };
}

/**
 * @param {(targetId: string, overId: string, x: number, y: number) => void} onDragUpdate
 */
export function useDraggableCursor(onDragUpdate) {
  const { UNSAFE_getDraggableStore } = useDraggableDispatch();

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
  const { tryMoveDrag, tryStopDrag } = useDraggableDispatch();

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
    document.addEventListener('mousemove', moveCallback);
    document.addEventListener('mouseup', upCallback);
    return () => {
      document.removeEventListener('mousemove', moveCallback);
      document.removeEventListener('mouseup', upCallback);
    };
  }, [moveCallback, upCallback]);
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
  const { tryAutoScroll } = useDraggableDispatch();
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
