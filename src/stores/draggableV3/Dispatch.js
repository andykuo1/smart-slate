import { NOOP } from '@/values/Functions';

import { zi } from '../ZustandImmerHelper';

/** @typedef {ReturnType<createDispatch>} Dispatch */

export const DRAGGABLE_BUFFER_RADIUS = 50;
export const DRAGGABLE_BUFFER_RADIUS_SQUARED =
  DRAGGABLE_BUFFER_RADIUS * DRAGGABLE_BUFFER_RADIUS;

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatch(set, get) {
  return {
    /** @type {() => Readonly<import('./Store').Store>} */
    UNSAFE_getStore: get,
    startDragging: zi(set, startDragging),
    stopDragging: zi(set, stopDragging),
    longStartOrStopDragging: zi(set, longStartOrStopDragging),
    updateDraggingOnMove: zi(set, updateDraggingOnMove),
    updateDraggingOnEnter: zi(set, updateDraggingOnEnter),
    updateDraggingOnLeave: zi(set, updateDraggingOnLeave),
  };
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ContainerId} containerId
 * @param {import('./Store').ElementId} elementId
 * @param {number} clientX
 * @param {number} clientY
 * @param {import('./Store').DraggableCompleteCallback} [completeCallback]
 */
function startDragging(
  store,
  containerId,
  elementId,
  clientX,
  clientY,
  completeCallback,
) {
  if (store.dragging) {
    // Cannot start drag in the middle of another.
    return;
  }
  store.containerId = containerId;
  store.elementId = elementId;
  store.overContainerId = '';
  store.overElementId = '';
  store.dragStartTime = Date.now();
  store.dragStart[0] = clientX;
  store.dragStart[1] = clientY;
  store.dragMove[0] = clientX;
  store.dragMove[1] = clientY;
  store.dragStop[0] = clientX;
  store.dragStop[1] = clientY;
  if (completeCallback) {
    store.completeCallback = completeCallback;
  } else {
    store.completeCallback = NOOP;
  }
}

/**
 * @param {import('./Store').Store} store
 * @param {number} clientX
 * @param {number} clientY
 */
function stopDragging(store, clientX, clientY) {
  try {
    if (store.dragging && store.completeCallback) {
      store.completeCallback(
        store.containerId,
        store.elementId,
        store.overContainerId,
        store.overElementId,
        clientX,
        clientY,
      );
    }
  } catch (e) {
    console.error(e);
  } finally {
    store.dragging = false;
    store.containerId = '';
    store.elementId = '';
    store.completeCallback = NOOP;
  }
  store.dragStartTime = Number.POSITIVE_INFINITY;
  store.dragStop[0] = clientX;
  store.dragStop[1] = clientY;
}

const LONG_START_DURATION_MILLIS = 500;

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ContainerId} containerId
 * @param {import('./Store').ElementId} elementId
 * @param {number} clientX
 * @param {number} clientY
 */
function longStartOrStopDragging(
  store,
  containerId,
  elementId,
  clientX,
  clientY,
) {
  if (!store.dragging) {
    let now = Date.now();
    let delta = now - store.dragStartTime;
    if (delta > LONG_START_DURATION_MILLIS) {
      startDragging(store, containerId, elementId, clientX, clientY);
      return;
    }
  }
  stopDragging(store, clientX, clientY);
}

/**
 * @param {import('./Store').Store} store
 * @param {number} clientX
 * @param {number} clientY
 */
function updateDraggingOnMove(store, clientX, clientY) {
  if (!store.elementId) {
    // Didn't actually pick up anything yet.
    return;
  }
  store.dragMove[0] = clientX;
  store.dragMove[1] = clientY;
  if (store.dragging) {
    return;
  }
  let dx = store.dragMove[0] - store.dragStart[0];
  let dy = store.dragMove[1] - store.dragStart[1];
  let distSqu = dx * dx + dy * dy;
  if (distSqu >= DRAGGABLE_BUFFER_RADIUS_SQUARED) {
    store.dragging = true;
  }
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ContainerId} containerId
 * @param {import('./Store').ElementId} elementId
 * @param {number} clientX
 * @param {number} clientY
 */
function updateDraggingOnEnter(
  store,
  containerId,
  elementId,
  clientX,
  clientY,
) {
  // NOTE: It is important this updates EVEN IF not
  //  yet started to drag, because it can already
  //  hover over another when drag buffer radius
  //  is not yet cleared.
  if (store.elementId === elementId) {
    return;
  }
  store.overContainerId = containerId;
  store.overElementId = elementId;
  store.dragMove[0] = clientX;
  store.dragMove[1] = clientY;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ContainerId} containerId
 * @param {import('./Store').ElementId} elementId
 * @param {number} clientX
 * @param {number} clientY
 */
function updateDraggingOnLeave(
  store,
  containerId,
  elementId,
  clientX,
  clientY,
) {
  // NOTE: It is important this updates EVEN IF not
  //  yet started to drag, because it can already
  //  hover over another when drag buffer radius
  //  is not yet cleared.
  if (store.elementId === elementId) {
    return;
  }
  if (store.overElementId === elementId) {
    store.overContainerId = '';
    store.overElementId = '';
  }
  store.dragMove[0] = clientX;
  store.dragMove[1] = clientY;
}
