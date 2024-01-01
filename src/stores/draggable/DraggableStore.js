/**
 * @typedef {ReturnType<createStore>} Store
 */

export function createStore() {
  return {
    dragTargetId: '',
    dragOverTargetId: '',
    dragStart: [0, 0],
    dragMove: [0, 0],
    dragStop: [0, 0],
    dragging: false,
    /** @type {import('./DraggableStoreContext').OnDragCompleteCallback|null} */
    completeCallback: null,
  };
}
