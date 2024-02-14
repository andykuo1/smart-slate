import { createDispatchForScanner } from './ScannerDispatch';
import { createDispatchForTranscoder } from './TranscoderDispatch';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatch(set, get) {
  return {
    /** @type {() => Readonly<import('./ToolboxStore').Store>} */
    UNSAFE_getToolboxStore: get,
    ...createDispatchForScanner(set, get),
    ...createDispatchForTranscoder(set, get),
  };
}
