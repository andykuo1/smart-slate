import { useCallback, useEffect } from 'react';

import { useAnimationFrame } from '@/libs/animationframe';

import {
  useDraggableDispatch,
  useDraggableStore,
  use_UNSAFE_getDraggableStore,
} from './DraggableStore';

/**
 * @callback DraggableCursorCallback
 * @param {import('./Store').ContainerId} containerId
 * @param {import('./Store').ElementId} elementId
 * @param {import('./Store').ContainerId} overContainerId
 * @param {import('./Store').ElementId} overElementId
 * @param {number} clientX
 * @param {number} clientY
 */

/**
 * @param {DraggableCursorCallback} callback
 */
export function useAsDraggableCursor(callback) {
  const UNSAFE_getDraggableStore = use_UNSAFE_getDraggableStore();

  const onAnimationFrame = useCallback(
    /** @type {FrameRequestCallback} */
    function _onAnimationFrame(now) {
      const store = UNSAFE_getDraggableStore();
      callback(
        store.containerId,
        store.elementId,
        store.overContainerId,
        store.overElementId,
        store.dragMove[0],
        store.dragMove[1],
      );
    },
    [UNSAFE_getDraggableStore, callback],
  );
  useAnimationFrame(onAnimationFrame);
}

/**
 * @callback DraggableElementPickUpCallback
 * @param {import('./Store').ContainerId} containerId
 * @param {import('./Store').ElementId} elementId
 * @param {number} clientX
 * @param {number} clientY
 * @returns {boolean}
 */

/**
 * @callback DraggableElementPutDownCallback
 * @param {import('./Store').ContainerId} containerId
 * @param {import('./Store').ElementId} elementId
 * @param {number} clientX
 * @param {number} clientY
 * @returns {boolean}
 */

/**
 * @param {import('react').RefObject<HTMLElement>} elementRef
 * @param {import('react').RefObject<HTMLElement>} handleRef
 * @param {import('./Store').ContainerId} containerId
 * @param {import('./Store').ElementId} elementId
 * @param {string} attachment
 * @param {DraggableElementPickUpCallback|boolean} [pickUpCallback]
 * @param {DraggableElementPutDownCallback|boolean} [putDownCallback]
 * @param {import('./Store').DraggableCompleteCallback} [completeCallback]
 */
export function useAsDraggableElement(
  elementRef,
  handleRef,
  containerId,
  elementId,
  attachment = '',
  pickUpCallback = true,
  putDownCallback = true,
  completeCallback,
) {
  const { startDragging, updateDraggingOnLeave, updateDraggingOnEnter } =
    useDraggableDispatch();

  const onMouseDown = useCallback(
    /** @param {PointerEvent} e */
    function _onMouseDown(e) {
      if (!e.isPrimary) {
        return;
      }
      if (
        typeof pickUpCallback !== 'function' ||
        // NOTE: If return false, can early out.
        pickUpCallback(containerId, elementId, e.clientX, e.clientY) !== false
      ) {
        startDragging(
          containerId,
          elementId,
          e.clientX,
          e.clientY,
          completeCallback,
        );
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [pickUpCallback, completeCallback, containerId, elementId, startDragging],
  );

  const onMouseEnter = useCallback(
    /** @param {PointerEvent} e */
    function _onMouseEnter(e) {
      if (!e.isPrimary) {
        return;
      }
      if (
        typeof putDownCallback !== 'function' ||
        // NOTE: If return false, can early out.
        putDownCallback(containerId, elementId, e.clientX, e.clientY) !== false
      ) {
        updateDraggingOnEnter(containerId, elementId, e.clientX, e.clientY);
      }
    },
    [containerId, elementId, putDownCallback, updateDraggingOnEnter],
  );

  const onMouseLeave = useCallback(
    /** @param {PointerEvent} e */
    function _onMouseLeave(e) {
      if (!e.isPrimary) {
        return;
      }
      updateDraggingOnLeave(containerId, elementId, e.clientX, e.clientY);
    },
    [containerId, elementId, updateDraggingOnLeave],
  );

  useEffect(() => {
    if (!pickUpCallback) {
      return;
    }
    const handle = handleRef.current;
    if (!handle) {
      return;
    }
    // NOTE: https://web.dev/articles/mobile-touchandmouse
    handle.addEventListener('pointerdown', onMouseDown);
    return () => {
      handle.removeEventListener('pointerdown', onMouseDown);
    };
  }, [pickUpCallback, handleRef, onMouseDown]);

  useEffect(() => {
    if (!putDownCallback) {
      return;
    }
    const element = elementRef.current;
    if (!element) {
      return;
    }
    element.setAttribute('data-draggable-id', elementId);
    element.setAttribute('data-draggable-attachment', attachment);
    element.addEventListener('pointerenter', onMouseEnter);
    element.addEventListener('pointerleave', onMouseLeave);
    return () => {
      element.removeAttribute('data-draggable-id');
      element.removeAttribute('data-draggable-attachment');
      element.removeEventListener('pointerenter', onMouseEnter);
      element.removeEventListener('pointerleave', onMouseLeave);
    };
  }, [
    putDownCallback,
    elementRef,
    attachment,
    containerId,
    elementId,
    onMouseEnter,
    onMouseLeave,
  ]);
}

export function findDraggableElements() {
  return document.querySelectorAll('[data-draggable-id]');
}

/**
 * @param {import('./Store').ElementId} elementId
 */
export function findDraggableElementById(elementId) {
  return document.querySelector(`[data-draggable-id="${elementId}"]`);
}

/**
 * @param {HTMLElement} element
 */
export function findNearestDraggableElement(element) {
  return /** @type {HTMLElement|null} */ (
    element.closest('[data-draggable-id]')
  );
}

/**
 * @param {HTMLElement|null} element
 */
export function getDraggableElementIdFromElement(element) {
  return element ? element.getAttribute('data-draggable-id') : null;
}

/**
 * @param {HTMLElement|null} element
 */
export function getDraggableElementAttachmentFromElement(element) {
  return element ? element.getAttribute('data-draggable-attachment') : '';
}

/**
 * @param {import('react').RefObject<HTMLElement>} [rootRef]
 */
export function useAsDraggableRoot(rootRef) {
  const { updateDraggingOnMove, longStartOrStopDragging, stopDragging } =
    useDraggableDispatch();

  const onMouseMove = useCallback(
    /** @param {PointerEvent} e */
    function _onMouseMove(e) {
      if (!e.isPrimary) {
        return;
      }
      updateDraggingOnMove(e.clientX, e.clientY);
    },
    [updateDraggingOnMove],
  );

  const onMouseUp = useCallback(
    /** @param {PointerEvent} e */
    function _onMouseUp(e) {
      if (!e.isPrimary) {
        return;
      }
      const target = /** @type {HTMLElement} */ (e.target);
      if (!target) {
        stopDragging(e.clientX, e.clientY);
        return;
      }
      const element = findNearestDraggableElement(target);
      const elementId = getDraggableElementIdFromElement(element);
      if (!element || !elementId) {
        stopDragging(e.clientX, e.clientY);
        return;
      }
      // TODO: Not yet ready.
      // longStartOrStopDragging(containerId, elementId, e.clientX, e.clientY);
      stopDragging(e.clientX, e.clientY);
    },
    [stopDragging, longStartOrStopDragging],
  );

  useEffect(() => {
    const element = /** @type {HTMLElement} */ (rootRef?.current ?? document);
    if (!element) {
      return;
    }
    element.addEventListener('pointermove', onMouseMove);
    element.addEventListener('pointerup', onMouseUp);
    return () => {
      element.removeEventListener('pointermove', onMouseMove);
      element.removeEventListener('pointerup', onMouseUp);
    };
  }, [rootRef, onMouseMove, onMouseUp]);
}

export function useIsDraggingAny() {
  return useDraggableStore((ctx) => ctx.dragging);
}

/**
 * @param {import('./Store').ElementId} elementId
 */
export function useIsDragging(elementId) {
  return useDraggableStore(
    (ctx) => ctx.dragging && ctx.elementId === elementId,
  );
}

/**
 * @param {import('./Store').ElementId} elementId
 */
export function useIsDraggingPotentially(elementId) {
  return useDraggableStore((ctx) => ctx.elementId === elementId);
}

export function useIsDraggingAnyPotentially() {
  return useDraggableStore((ctx) => Boolean(ctx.elementId));
}

/**
 * @param {import('./Store').ElementId} elementId
 */
export function useIsDraggingOver(elementId) {
  return useDraggableStore(
    (ctx) => ctx.dragging && ctx.overElementId === elementId,
  );
}

export function useDraggableElementId() {
  return useDraggableStore((ctx) => ctx.elementId);
}

export function useDraggableOverElementId() {
  return useDraggableStore((ctx) => ctx.overElementId);
}
