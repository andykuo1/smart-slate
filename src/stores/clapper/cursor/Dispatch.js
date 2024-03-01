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
    focusClapper: zi(set, focusClapper),
    focusClap: zi(set, focusClap),
    changeSceneNumber: zi(set, changeSceneNumber),
    changeShotNumber: zi(set, changeShotNumber),
    changeRollName: zi(set, changeRollName),
  };
}

/**
 * @param {import('./Store').Store} store
 * @param {import('@/stores/clapper/Store').ClapperId} clapperId
 */
function focusClapper(store, clapperId) {
  store.clapperId = clapperId;
  store.clapId = '';
}

/**
 * @param {import('./Store').Store} store
 * @param {import('@/stores/clapper/Store').ClapperId} clapperId
 * @param {import('@/stores/clapper/Store').ClapId} clapId
 */
function focusClap(store, clapperId, clapId) {
  store.clapperId = clapperId;
  store.clapId = clapId;
}

/**
 * @param {import('./Store').Store} store
 * @param {number} sceneNumber
 */
function changeSceneNumber(store, sceneNumber) {
  store.sceneNumber = sceneNumber;
}

/**
 * @param {import('./Store').Store} store
 * @param {number} shotNumber
 */
function changeShotNumber(store, shotNumber) {
  store.shotNumber = shotNumber;
}

/**
 * @param {import('./Store').Store} store
 * @param {string} rollName
 */
function changeRollName(store, rollName) {
  store.rollName = rollName;
}
