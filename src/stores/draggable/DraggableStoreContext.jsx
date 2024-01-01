import { useCallback, useEffect, useRef } from 'react';

import { useAnimationFrame } from '@/libs/animationframe';
import { NOOP } from '@/values/Functions';

import { getCompleteCallback } from './DraggableDispatch';
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
 * @param {string} targetContainerId
 * @param {string} targetId
 * @param {string} overContainerId
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

export function useOnCompleteCallback() {
  return useDraggableStore((ctx) => getCompleteCallback(ctx));
}

/**
 * https://web.dev/articles/mobile-touchandmouse
 * @param {string} containerId
 * @param {string} targetId
 */
function useTouchHandler(containerId, targetId) {
  const tryStartDrag = useDraggableStore((ctx) => ctx.tryStartDrag);
  const tryMoveDrag = useDraggableStore((ctx) => ctx.tryMoveDrag);
  const tryStopDrag = useDraggableStore((ctx) => ctx.tryStopDrag);
  const completeCallback = useOnCompleteCallback();

  const onTouchStart = useCallback(
    /** @param {TouchEvent} e */
    function _onTouchStart(e) {
      const target = /** @type {HTMLElement} */ (e.target);
      const touch = e.touches[0];
      if (!touch) {
        return;
      }

      /** @param {TouchEvent} e */
      function onTouchMove(e) {
        const touch = e.touches[0];
        if (!touch) {
          return;
        }
        tryMoveDrag(touch.clientX, touch.clientY);
      }

      /** @param {TouchEvent} e */
      function onTouchEnd(e) {
        const touch = e.changedTouches[0];
        if (!touch) {
          onTouchCancel(e);
          return;
        }
        if (!completeCallback) {
          onTouchCancel(e);
          return;
        }
        target.removeEventListener('touchmove', onTouchMove);
        target.removeEventListener('touchend', onTouchEnd);
        target.removeEventListener('touchcancel', onTouchCancel);
        tryStopDrag(touch.clientX, touch.clientY, completeCallback);
      }

      /** @param {TouchEvent} e */
      function onTouchCancel(e) {
        target.removeEventListener('touchmove', onTouchMove);
        target.removeEventListener('touchend', onTouchEnd);
        target.removeEventListener('touchcancel', onTouchCancel);
        tryStopDrag(0, 0, NOOP);
      }

      target.addEventListener('touchmove', onTouchMove);
      target.addEventListener('touchend', onTouchEnd);
      target.addEventListener('touchcancel', onTouchCancel);

      tryStartDrag(containerId, targetId, touch.clientX, touch.clientY);
      e.preventDefault();
    },
    [tryStartDrag, tryMoveDrag, tryStopDrag, completeCallback],
  );

  return onTouchStart;
}

/**
 * @param {string} containerId
 * @param {string} targetId
 */
export function useDraggable(containerId, targetId) {
  /** @type {import('react').MutableRefObject<any>} */
  const elementRef = useRef(null);
  const tryStartDrag = useDraggableStore((ctx) => ctx.tryStartDrag);
  const tryMoveDragEnter = useDraggableStore((ctx) => ctx.tryMoveDragEnter);
  const tryMoveDragLeave = useDraggableStore((ctx) => ctx.tryMoveDragLeave);

  const onTouchStart = useTouchHandler(containerId, targetId);

  /** @type {import('react').MouseEventHandler} */
  function onMouseDown(e) {
    tryStartDrag(containerId, targetId, e.clientX, e.clientY);
  }

  /** @type {import('react').MouseEventHandler} */
  function onMouseEnter(e) {
    tryMoveDragEnter(containerId, targetId, e.clientX, e.clientY);
  }

  /** @type {import('react').MouseEventHandler} */
  function onMouseLeave(e) {
    tryMoveDragLeave(targetId, e.clientX, e.clientY);
  }

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }
    /** @type {AddEventListenerOptions} */
    const touchStartOptions = { passive: false };
    element.addEventListener('touchstart', onTouchStart, touchStartOptions);
    return () =>
      element.removeEventListener(
        'touchstart',
        onTouchStart,
        touchStartOptions,
      );
  }, [elementRef, onTouchStart]);

  return {
    elementProps: {
      'data-draggable': targetId,
      onMouseEnter: useCallback(onMouseEnter, [targetId, tryMoveDragEnter]),
      onMouseLeave: useCallback(onMouseLeave, [targetId, tryMoveDragLeave]),
    },
    handleProps: {
      ref: elementRef,
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
 * @param {OnDragCompleteCallback} onDragComplete
 */
export function useDraggableContainer(onDragComplete) {
  const { tryMoveDrag, tryStopDrag, setCompleteCallback } = useDraggableStore();

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
    setCompleteCallback(onDragComplete);
    document.addEventListener('mousemove', moveCallback);
    document.addEventListener('mouseup', upCallback);
    return () => {
      setCompleteCallback(null);
      document.removeEventListener('mousemove', moveCallback);
      document.removeEventListener('mouseup', upCallback);
    };
  }, [onDragComplete, moveCallback, upCallback]);
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
