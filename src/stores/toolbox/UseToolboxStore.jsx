import { create } from 'zustand';

import { createDispatch } from './ToolboxDispatch';
import { createStore } from './ToolboxStore';

/** @typedef {import('./ToolboxStore').Store & import('./ToolboxDispatch').Dispatch} StoreAndDispatch */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
export const useToolboxStore = create((set, get) => ({
  ...createStore(),
  ...createDispatch(set, get),
}));
