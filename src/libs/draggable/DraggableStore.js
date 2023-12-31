import { produce } from 'immer';
import { create } from 'zustand';

import {
  applyAutoScroll,
  applyDragEnter,
  applyDragLeave,
  applyDragMove,
  applyDragStart,
  applyDragStop,
  applyUpdateElementRect,
  applyUpdateElementRef,
} from './DraggableApplier';

/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createDispatch>} Dispatch
 * @typedef {ReturnType<createApplier>} Applier
 * @typedef {import('zustand').StoreApi<Store>['setState']} StoreSetter
 * @typedef {import('zustand').StoreApi<Store>['getState']} StoreGetter
 * @typedef {Store & Dispatch} StoreAndDispatch
 */

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>}
 */
export const useStore = create((set, get) => ({
  ...createStore(),
  ...createDispatch(createApplier(set, get)),
}));

/**
 * @param {StoreSetter} set
 * @param {StoreGetter} get
 */
function createApplier(set, get) {
  return {
    /** @type {StoreSetter} */
    set,
    /** @type {StoreGetter} */
    get,
  };
}

function createStore() {
  return {
    dragTargetId: '',
    dragOverTargetId: '',
    dragStart: [0, 0],
    dragMove: [0, 0],
    dragStop: [0, 0],
    dragging: false,
    /** @type {Record<string, import('react').RefObject<Element>>} */
    elementRefs: {},
    /** @type {Record<string, DOMRect|null>} */
    elementRects: {},
  };
}

/**
 * @param {Applier} applier
 */
function createDispatch(applier) {
  return {
    tryUpdateElementRef: withStore(applier, applyUpdateElementRef),
    tryUpdateElementRect: withStore(applier, applyUpdateElementRect),
    tryStartDrag: withStore(applier, applyDragStart),
    tryStopDrag: withStore(applier, applyDragStop),
    tryMoveDrag: withStore(applier, applyDragMove),
    tryMoveDragEnter: withStore(applier, applyDragEnter),
    tryMoveDragLeave: withStore(applier, applyDragLeave),
    tryAutoScroll: withApplier(applier, applyAutoScroll),
    UNSAFE_getDraggableStore() {
      return applier.get();
    },
  };
}

/**
 * @template {Array<?>} T
 * @param {Applier} applier
 * @param {(store: Store, ...rest: T) => void} dispatcher
 * @returns {(...args: T) => void}
 */
function withStore(applier, dispatcher) {
  return function appliedStoreCallback(...args) {
    // @ts-ignore
    applier.set(produce((draft) => dispatcher(draft, ...args)));
  };
}

/**
 * @template {Array<?>}T
 * @template R
 * @param {Applier} applier
 * @param {(applier: Applier, ...rest: T) => R} callback
 * @returns {(...args: T) => R}
 */
function withApplier(applier, callback) {
  return function appliedCallback(...args) {
    return callback(applier, ...args);
  };
}
