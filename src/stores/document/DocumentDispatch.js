import { createDispatchAddDelete } from './dispatch/DispatchAddDelete';
import { createDispatchDocumentSettings } from './dispatch/DispatchDocumentSettings';
import { createDispatchDocuments } from './dispatch/DispatchDocuments';
import { createDispatchShots } from './dispatch/DispatchShots';
import { createDispatchTakes } from './dispatch/DispatchTakes';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatch(set, get) {
  return {
    /** @type {() => import('./DocumentStore').Store} */
    UNSAFE_getStore: get,
    ...createDispatchAddDelete(set, get),
    ...createDispatchDocuments(set, get),
    ...createDispatchDocumentSettings(set, get),
    ...createDispatchShots(set, get),
    ...createDispatchTakes(set, get),
  };
}
