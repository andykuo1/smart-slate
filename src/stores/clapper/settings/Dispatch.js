import { zi } from '../../ZustandImmerHelper';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatch(set, get) {
  return {
    /** @type {() => Readonly<import('./Store').Store>} */
    UNSAFE_getStore: get,
    toggleBlackboardSettings: zi(set, toggleBlackboardSettings),
  };
}

/**
 * @param {import('./Store').Store} store
 * @param {boolean} [force]
 */
function toggleBlackboardSettings(store, force) {
  store.blackboard = typeof force !== 'undefined' ? force : !store.blackboard;
}
