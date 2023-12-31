import {
  DRAG_AUTOSCROLL_SPEED,
  DRAG_START_BUFFER_RADIUS_SQUARED,
} from './UseDraggable';

/**
 * @param {import('./DraggableStore').Store} draft
 * @param {string} targetId
 * @param {number} x
 * @param {number} y
 */
export function applyDragStart(draft, targetId, x, y) {
  // Cannot start drag in the middle of another.
  if (draft.dragging) {
    return;
  }
  draft.dragTargetId = targetId;
  draft.dragOverTargetId = '';
  draft.dragStart[0] = x;
  draft.dragStart[1] = y;
  draft.dragMove[0] = x;
  draft.dragMove[1] = y;
  draft.dragStop[0] = x;
  draft.dragStop[1] = y;
}

/**
 * @param {import('./DraggableStore').Store} draft
 * @param {number} x
 * @param {number} y
 * @param {(targetId: string, overId: string, x: number, y: number) => void} callback
 */
export function applyDragStop(draft, x, y, callback) {
  if (draft.dragging) {
    callback(draft.dragTargetId, draft.dragOverTargetId, x, y);
  }
  draft.dragging = false;
  draft.dragTargetId = '';
  draft.dragStop[0] = x;
  draft.dragStop[1] = y;
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
 * @param {string} targetId
 * @param {number} x
 * @param {number} y
 */
export function applyDragEnter(draft, targetId, x, y) {
  if (!draft.dragging) {
    return;
  }
  if (draft.dragTargetId === targetId) {
    return;
  }
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
    draft.dragOverTargetId = '';
  }
  draft.dragMove[0] = x;
  draft.dragMove[1] = y;
}

/**
 * @param {import('./DraggableStore').Applier} applier
 * @param {HTMLElement} scrollContainer
 * @param {number} scrollSpeedX
 * @param {number} scrollSpeedY
 */
export function applyAutoScroll(
  applier,
  scrollContainer,
  scrollSpeedX,
  scrollSpeedY,
) {
  const { dragging, dragMove } = applier.get();
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

/**
 * @param {import('./DraggableStore').Store} store
 * @param {string} targetId
 * @param {import('react').RefObject<any>} elementRef
 */
export function applyUpdateElementRef(store, targetId, elementRef) {
  store.elementRefs[targetId] = elementRef;
}

/**
 * @param {import('./DraggableStore').Store} store
 * @param {string} targetId
 */
export function applyUpdateElementRect(store, targetId) {
  /** @type {Element|null} */
  const target = store.elementRefs[targetId]?.current;
  if (!target) {
    store.elementRects[targetId] = null;
    return;
  }
  const rect = target.getBoundingClientRect();
  store.elementRects[targetId] = rect;
}
