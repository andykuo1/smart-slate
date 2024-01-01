import { zi, ziget } from '@/stores/ZustandImmerHelper';

import {
  DRAG_AUTOSCROLL_SPEED,
  DRAG_START_BUFFER_RADIUS_SQUARED,
} from './DraggableStoreContext';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatch(set, get) {
  return {
    tryStartDrag: zi(set, applyDragStart),
    tryStopDrag: zi(set, applyDragStop),
    tryMoveDrag: zi(set, applyDragMove),
    tryMoveDragEnter: zi(set, applyDragEnter),
    tryMoveDragLeave: zi(set, applyDragLeave),
    tryAutoScroll: ziget(get, applyAutoScroll),
    setCompleteCallback: zi(set, setCompleteCallback),
    UNSAFE_getDraggableStore: get,
  };
}

/**
 * @param {import('./DraggableStore').Store} store
 */
export function getCompleteCallback(store) {
  return store.completeCallback;
}

/**
 * @param {import('./DraggableStore').Store} store
 * @param {import('./DraggableStoreContext').OnDragCompleteCallback|null} callback
 */
export function setCompleteCallback(store, callback) {
  store.completeCallback = callback;
}

/**
 * @param {import('./DraggableStore').Store} draft
 * @param {string} containerId
 * @param {string} targetId
 * @param {number} x
 * @param {number} y
 */
export function applyDragStart(draft, containerId, targetId, x, y) {
  // Cannot start drag in the middle of another.
  if (draft.dragging) {
    return;
  }
  draft.dragContainerId = containerId;
  draft.dragTargetId = targetId;
  draft.dragOverContainerId = '';
  draft.dragOverTargetId = '';
  draft.dragStart[0] = x;
  draft.dragStart[1] = y;
  draft.dragMove[0] = x;
  draft.dragMove[1] = y;
  draft.dragStop[0] = x;
  draft.dragStop[1] = y;
}

/**
 * @param {import('./DraggableStore').Store} store
 * @param {number} x
 * @param {number} y
 * @param {import('./DraggableStoreContext').OnDragCompleteCallback} callback
 */
export function applyDragStop(store, x, y, callback) {
  if (store.dragging) {
    callback(
      store.dragContainerId,
      store.dragTargetId,
      store.dragOverContainerId,
      store.dragOverTargetId,
      x,
      y,
    );
  }
  store.dragging = false;
  store.dragContainerId = '';
  store.dragTargetId = '';
  store.dragStop[0] = x;
  store.dragStop[1] = y;
}

/**
 * @param {import('./DraggableStore').Store} draft
 * @param {number} x
 * @param {number} y
 */
export function applyDragMove(draft, x, y) {
  if (!draft.dragTargetId) {
    return;
  }
  draft.dragMove[0] = x;
  draft.dragMove[1] = y;
  if (draft.dragging) {
    return;
  }
  let dx = draft.dragMove[0] - draft.dragStart[0];
  let dy = draft.dragMove[1] - draft.dragStart[1];
  let distSqu = dx * dx + dy * dy;
  if (distSqu >= DRAG_START_BUFFER_RADIUS_SQUARED) {
    draft.dragging = true;
  }
}

/**
 * @param {import('./DraggableStore').Store} draft
 * @param {string} containerId
 * @param {string} targetId
 * @param {number} x
 * @param {number} y
 */
export function applyDragEnter(draft, containerId, targetId, x, y) {
  if (!draft.dragging) {
    return;
  }
  if (draft.dragTargetId === targetId) {
    return;
  }
  draft.dragOverContainerId = containerId;
  draft.dragOverTargetId = targetId;
  draft.dragMove[0] = x;
  draft.dragMove[1] = y;
}

/**
 * @param {import('./DraggableStore').Store} draft
 * @param {string} targetId
 * @param {number} x
 * @param {number} y
 */
export function applyDragLeave(draft, targetId, x, y) {
  if (!draft.dragging) {
    return;
  }
  if (draft.dragTargetId === targetId) {
    return;
  }
  if (draft.dragOverTargetId === targetId) {
    draft.dragOverContainerId = '';
    draft.dragOverTargetId = '';
  }
  draft.dragMove[0] = x;
  draft.dragMove[1] = y;
}

/**
 * @param {import('./DraggableStore').Store} store
 * @param {HTMLElement} scrollContainer
 * @param {number} scrollSpeedX
 * @param {number} scrollSpeedY
 */
export function applyAutoScroll(
  store,
  scrollContainer,
  scrollSpeedX,
  scrollSpeedY,
) {
  const { dragging, dragMove } = store;
  if (!dragging) {
    return;
  }
  const [x, y] = dragMove;
  const rect = scrollContainer.getBoundingClientRect();
  const speed = DRAG_AUTOSCROLL_SPEED;

  if (scrollSpeedX > 0) {
    const mx = rect.width / 3;
    let dx = 0;
    let rx = 0;
    if (x < rect.left + mx) {
      // Left scrolling
      dx = -speed;
      rx = 1 - Math.max(x - rect.left, 0) / mx;
    } else if (x > rect.right - mx) {
      // Right scrolling
      dx = speed;
      rx = 1 - Math.max(rect.right - x, 0) / mx;
    }
    if (dx * dx >= speed) {
      rx *= rx; // Exponential speed!
      scrollContainer.scrollLeft += dx * rx * scrollSpeedX;
    }
  }

  if (scrollSpeedY > 0) {
    const my = rect.height / 3;
    let dy = 0;
    let ry = 0;
    if (y < rect.top + my) {
      // Top scrolling
      dy = -speed;
      ry = 1 - Math.max(y - rect.top, 0) / my;
    } else if (y > rect.bottom - my) {
      // Bottom scrolling
      dy = speed;
      ry = 1 - Math.max(rect.bottom - y, 0) / my;
    }
    if (dy * dy > speed) {
      ry *= ry; // Exponential speed!
      scrollContainer.scrollTop += dy * ry * scrollSpeedY;
    }
  }
}
