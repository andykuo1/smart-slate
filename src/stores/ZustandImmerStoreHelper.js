import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * @template Store
 * @callback CreateStore
 * @returns {Store}
 */

/**
 * @template Dispatch
 * @callback CreateDispatch
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 * @returns {Dispatch}
 */

/**
 * @template Store
 * @callback FindVersion
 * @param {Store} store
 * @returns {string|undefined}
 */

/**
 * @template Store
 * @callback CloneStore
 * @param {Partial<Store>} out
 * @param {Partial<Store>} store
 * @returns {Store}
 */

/**
 * @template Store, Dispatch
 * @param {object} opts
 * @param {CreateStore<Store>} opts.createStore
 * @param {CreateDispatch<Dispatch>} opts.createDispatch
 */
export function createZIStoreInMemory(opts) {
  const { createStore, createDispatch } = opts;

  /** @typedef {Store & { dispatch: Dispatch }} StoreAndDispatch */
  /** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
  let result = create((set, get) => ({
    ...createStore(),
    dispatch: {
      ...createDispatch(set, get),
    },
  }));
  return result;
}

/**
 * @template Store, Dispatch
 * @param {string} name
 * @param {number} version
 * @param {object} opts
 * @param {CreateStore<Store>} opts.createStore
 * @param {CreateDispatch<Dispatch>} opts.createDispatch
 * @param {FindVersion<Store>} opts.findVersion
 * @param {CloneStore<Store>} opts.cloneStore
 */
export function createZIStoreInLocalStorage(name, version, opts) {
  const { createStore, createDispatch, findVersion, cloneStore } = opts;

  /** @typedef {Store & { dispatch: Dispatch }} StoreAndDispatch */
  /** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreAndDispatch>>} */
  let result = create(
    persist(
      (set, get) => ({
        ...createStore(),
        dispatch: {
          ...createDispatch(set, get),
        },
      }),
      {
        name,
        storage: createJSONStorage(() => localStorage),
        version,
        /**
         * @param {StoreAndDispatch} state
         * @returns {Store} The part of the state to persist.
         */
        partialize(state) {
          const { dispatch, ...rest } = state;
          const store = /** @type {Store} */ (rest);
          return store;
        },
        /**
         * @param {unknown} persistedState
         * @param {unknown} version
         * @returns {Promise<any>} The migrated persisted state.
         */
        async migrate(persistedState, version) {
          const newStore = createStore();
          const persistedStore = /** @type {Store} */ (persistedState);
          const currentVersion = findVersion(newStore) ?? `[v${version}]`;
          const persistedVersion = findVersion(persistedStore);
          if (currentVersion !== persistedVersion) {
            console.log(
              `[ClapperStore] Migrating persisted stores ${persistedVersion} => ${currentVersion}.`,
            );
          }
          let cloned = cloneStore(newStore, persistedStore);
          // NOTE: persistedStore is partialized-- so it doesn't have dispatch.
          return /** @type {any} */ (cloned);
        },
        /**
         * @param {unknown} persistedState
         * @param {StoreAndDispatch} currentState
         * @returns {StoreAndDispatch} The merged current state.
         */
        merge(persistedState, currentState) {
          const { dispatch, ...rest } = currentState;
          const currentStore = /** @type {Store} */ (rest);
          const newStore = createStore();
          const persistedStore = /** @type {Store} */ (persistedState);
          const currentVersion = findVersion(currentStore) ?? `[v${version}]`;
          const persistedVersion = findVersion(persistedStore);
          if (currentVersion !== persistedVersion) {
            console.log(
              `[ClapperStore] Merging persisted stores ${persistedVersion} => ${currentVersion}.`,
            );
          }
          let cloned = cloneStore(newStore, currentStore);
          cloneStore(cloned, persistedStore);
          return {
            dispatch,
            ...cloned,
          };
        },
      },
    ),
  );
  return result;
}
