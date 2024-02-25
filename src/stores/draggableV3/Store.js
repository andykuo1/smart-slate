/** @typedef {ReturnType<createStore>} Store */
/** @typedef {ReturnType<createDraggableVector>} DraggableVector */

/**
 * @callback DraggableCompleteCallback
 * @param {import('./Store').ContainerId} containerId
 * @param {import('./Store').ElementId} elementId
 * @param {import('./Store').ContainerId} overContainerId
 * @param {import('./Store').ElementId} overElementId
 * @param {number} clientX
 * @param {number} clientY
 */

/** @typedef {string} ContainerId */
/** @typedef {string} ElementId */

export function createStore() {
  return {
    /** @type {ContainerId} */
    containerId: '',
    /** @type {ElementId} */
    elementId: '',
    /** @type {ContainerId} */
    overContainerId: '',
    /** @type {ElementId} */
    overElementId: '',
    dragStartTime: Number.POSITIVE_INFINITY,
    dragStart: createDraggableVector(),
    dragMove: createDraggableVector(),
    dragStop: createDraggableVector(),
    dragging: false,
    /** @type {DraggableCompleteCallback|null} */
    completeCallback: null,
  };
}

/** @returns {[number, number]} */
export function createDraggableVector() {
  return [0, 0];
}
