import { create } from 'zustand';

import { createDispatch } from './Dispatch';
import { createStore } from './Store';

/** @typedef {import('./Store').Store & { dispatch: import('./Dispatch').Dispatch }} StoreAndDispatch */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
export const useDraggableStore = create((set, get) => ({
  ...createStore(),
  dispatch: {
    ...createDispatch(set, get),
  },
}));

export function useDraggableDispatch() {
  return useDraggableStore((ctx) => ctx.dispatch);
}

export function useUNSAFE_getDraggableStore() {
  return useDraggableStore((ctx) => ctx.dispatch.UNSAFE_getStore);
}
