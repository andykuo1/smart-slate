/**
 * @typedef {ReturnType<createStore>} Store
 */

export function createStore() {
  return {
    dragContainerId: '',
    dragTargetId: '',
    dragOverContainerId: '',
    dragOverTargetId: '',
    dragStart: [0, 0],
    dragMove: [0, 0],
    dragStop: [0, 0],
    dragging: false,
    /** @type {import('./DraggableStoreContext').OnDragCompleteCallback|null} */
    completeCallback: null,
  };
}
