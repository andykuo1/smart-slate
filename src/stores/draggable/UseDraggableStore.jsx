import { create } from 'zustand';

import { createDispatch } from './DraggableDispatch';
import { createStore } from './DraggableStore';

/** @typedef {import('./DraggableStore').Store & import('./DraggableDispatch').Dispatch} StoreAndDispatch */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
export const useDraggableStore = create((set, get) => ({
  ...createStore(),
  ...createDispatch(set, get),
}));
