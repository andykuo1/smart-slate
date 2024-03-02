import { zi } from '../ZustandImmerHelper';
import {
  findNextAvailableShotHash,
  getClapById,
  getClapperById,
  getSlateById,
} from './GetClapper';
import { createClapperDetails } from './Store';

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
    changeDirectorName: zi(set, changeDirectorName),
    changeCameraName: zi(set, changeCameraName),
    changeClapRollName: zi(set, changeClapRollName),
    toggleClapPrintRating: zi(set, toggleClapPrintRating),
    changeClapComments: zi(set, changeClapComments),
    changeClapQRCodeKey: zi(set, changeClapQRCodeKey),
    addClapper: zi(set, addClapper),
    addClap: zi(set, addClap),
    addSlate: zi(set, addSlate),
    deleteClapper: zi(set, deleteClapper),
    obtainSlateTakeNumber: zi(set, obtainSlateTakeNumber),
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
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {string} value
 */
function changeDirectorName(store, clapperId, value) {
  let clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return;
  }
  let details = resolveClapperDetails(clapper);
  details.directorName = value;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {string} value
 */
function changeCameraName(store, clapperId, value) {
  let clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return;
  }
  let details = resolveClapperDetails(clapper);
  details.cameraName = value;
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
 * @param {import('./Store').SlateId} slateId
 * @param {import('./Store').Clap} clap
 */
function addClap(store, clapperId, slateId, clap) {
  let clapper = getClapperById(store, clapperId);
  clapper.claps[clap.clapId] = clap;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').Slate} slate
 */
function addSlate(store, clapperId, slate) {
  let clapper = getClapperById(store, clapperId);
  if (!slate.shotHash) {
    let shotHash = findNextAvailableShotHash(store, clapperId);
    slate.shotHash = shotHash;
  }
  clapper.shotHashes[slate.shotHash] = slate.slateId;
  clapper.slates[slate.slateId] = slate;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 */
function deleteClapper(store, clapperId) {
  delete store.clappers[clapperId];
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').SlateId} slateId
 * @param {import('./Store').ClapId} clapId The clap id associated to the obtained take number.
 */
function obtainSlateTakeNumber(store, clapperId, slateId, clapId) {
  let slate = getSlateById(store, clapperId, slateId);
  let takeNumber = slate.nextTakeNumber;
  if (!slate.clapIds.includes(clapId)) {
    slate.clapIds.push(clapId);
  }
  let clap = getClapById(store, clapperId, clapId);
  if (clap && clap.takeNumber !== takeNumber) {
    clap.takeNumber = takeNumber;
  }
  slate.nextTakeNumber += 1;
}
