import {
  formatProjectId,
  formatSceneShotNumber,
} from '@/components/takes/TakeNameFormat';
import { tryEncodeQRCodeKeyV1 } from '@/serdes/UseResolveTakeQRCodeKey';
import { uuid } from '@/utils/uuid';

import { zi } from '../ZustandImmerHelper';
import {
  findNextAvailableShotHashString,
  findShotHashBySceneShotNumber,
  getClapById,
  getClapperById,
} from './GetClapper';
import { createClapperDetails, createShotHash } from './Store';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatch(set, get) {
  return {
    /** @type {() => Readonly<import('./Store').Store>} */
    UNSAFE_getStore: get,
    changeProductionTitle: zi(set, changeProductionTitle),
    changeClapRollName: zi(set, changeClapRollName),
    toggleClapPrintRating: zi(set, toggleClapPrintRating),
    changeClapComments: zi(set, changeClapComments),
    changeClapQRCodeKey: zi(set, changeClapQRCodeKey),
    addClapper: zi(set, addClapper),
    addClap: zi(set, addClap),
    addShotHash: zi(set, addShotHash),
    finalizeClap: zi(set, finalizeClap),
    deleteClapper: zi(set, deleteClapper),
  };
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {string} value
 */
function changeProductionTitle(store, clapperId, value) {
  let clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return;
  }
  let details = resolveClapperDetails(clapper);
  details.productionTitle = value;
}

/**
 * @param {import('./Store').Clapper} clapper
 */
function resolveClapperDetails(clapper) {
  let result = clapper.details;
  if (!result) {
    clapper.details = createClapperDetails();
  }
  return result;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ClapId} clapId
 * @param {string} value
 */
function changeClapRollName(store, clapperId, clapId, value) {
  let clap = getClapById(store, clapperId, clapId);
  if (!clap) {
    return;
  }
  clap.rollName = value;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ClapId} clapId
 * @param {boolean} [force]
 */
function toggleClapPrintRating(store, clapperId, clapId, force) {
  let clap = getClapById(store, clapperId, clapId);
  if (!clap) {
    return;
  }
  clap.printRating = force ?? clap.printRating > 0 ? -1 : 1;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ClapId} clapId
 * @param {string} value
 */
function changeClapComments(store, clapperId, clapId, value) {
  let clap = getClapById(store, clapperId, clapId);
  if (!clap) {
    return;
  }
  clap.comments = value;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ClapId} clapId
 * @param {string} value
 */
function changeClapQRCodeKey(store, clapperId, clapId, value) {
  let clap = getClapById(store, clapperId, clapId);
  if (!clap) {
    return;
  }
  clap.qrCodeKey = value;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').Clapper} clapper
 */
function addClapper(store, clapper) {
  clapper.firstCreatedMillis = Date.now();
  clapper.lastUpdatedMillis = clapper.firstCreatedMillis;
  clapper.lastDeletedMillis = 0;
  clapper.lastExportedMillis = 0;
  store.clappers[clapper.clapperId] = clapper;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').Clap} clap
 */
function addClap(store, clapperId, clap) {
  let clapper = getClapperById(store, clapperId);
  clapper.claps[clap.clapId] = clap;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ShotHash} shotHash
 */
function addShotHash(store, clapperId, shotHash) {
  let clapper = getClapperById(store, clapperId);
  clapper.shotHashStrings[shotHash.string] = shotHash.shotHashId;
  clapper.shotHashes[shotHash.shotHashId] = shotHash;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {number} sceneNumber
 * @param {number} shotNumber
 */
function resolveShotHash(store, clapperId, sceneNumber, shotNumber) {
  let result = findShotHashBySceneShotNumber(
    store,
    clapperId,
    sceneNumber,
    shotNumber,
  );
  if (result) {
    return result;
  }
  result = createShotHash();
  result.sceneNumber = sceneNumber;
  result.shotNumber = shotNumber;
  result.nextTakeNumber = 1;
  result.string = findNextAvailableShotHashString(store, clapperId);
  addShotHash(store, clapperId, result);
  return result;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {string} rollName
 * @param {import('./Store').Clap} clap
 */
function finalizeClap(
  store,
  clapperId,
  sceneNumber,
  shotNumber,
  rollName,
  clap,
) {
  const shotHash = resolveShotHash(store, clapperId, sceneNumber, shotNumber);

  let result = clap;
  result.rollName = rollName;
  result.sceneNumber = sceneNumber;
  result.shotNumber = shotNumber;
  result.takeNumber = shotHash.nextTakeNumber;
  shotHash.nextTakeNumber += 1;
  if (!shotHash.clapIds.includes(clap.clapId)) {
    shotHash.clapIds.push(clap.clapId);
  }
  result.timestampMillis = Date.now();
  result.takeId = uuid();

  const clapper = getClapperById(store, clapperId);
  const projectId = formatProjectId(clapper.details?.productionTitle ?? '');
  const sceneShotNumber = formatSceneShotNumber(sceneNumber, shotNumber, false);
  const qrCodeKey = tryEncodeQRCodeKeyV1(
    projectId,
    sceneShotNumber,
    result.takeNumber,
    shotHash.string,
    result.takeId,
  );
  result.qrCodeKey = qrCodeKey;

  if (!getClapById(store, clapperId, clap.clapId)) {
    addClap(store, clapperId, result);
  }
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 */
function deleteClapper(store, clapperId) {
  delete store.clappers[clapperId];
}
