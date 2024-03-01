import { slowShallowCopyObjects } from '@/utils/ObjectCopy';
import { uuid } from '@/utils/uuid';

/** @typedef {ReturnType<createStore>} Store */
/** @typedef {ReturnType<createClapper>} Clapper */
/** @typedef {ReturnType<createClap>} Clap */
/** @typedef {ReturnType<createClapperDetails>} ClapperDetails */
/** @typedef {ReturnType<createShotHash>} ShotHash */

/** @typedef {string} ClapperId */
/** @typedef {string} ClapId */
/** @typedef {string} ShotHashId */

export const CURRENT_CLAPPER_VERSION = 1;

export function createStore() {
  return {
    /** @type {Record<ClapperId, Clapper>} */
    clappers: {},
  };
}

export function createClapper(clapperId = uuid()) {
  return {
    clapperId,
    clapperVersion: CURRENT_CLAPPER_VERSION,
    details: createClapperDetails(),
    /** @type {Record<ClapId, Clap>} */
    claps: {},
    /** @type {Record<ShotHashId, ShotHash>} */
    shotHashes: {},
    /** @type {Record<string, ShotHashId>} */
    shotHashStrings: {},
  };
}

export function createClap(clapId = uuid()) {
  return {
    clapId,
    timestampMillis: 0,
    sceneNumber: 0,
    shotNumber: 0,
    takeNumber: 0,
    takeId: '',
    rollName: '',
    comments: '',
    printRating: 0,
    qrCodeKey: '',
  };
}

export function createShotHash(shotHashId = uuid()) {
  return {
    shotHashId,
    sceneNumber: 0,
    shotNumber: 0,
    nextTakeNumber: 1,
    /** @type {Array<ClapId>} */
    clapIds: [],
    string: '',
  };
}

export function createClapperDetails() {
  return {
    productionTitle: '',
    directorName: '',
    cameraName: '',
  };
}

/**
 * @param {Partial<Store>} out
 * @param {Partial<Store>} store
 */
export function cloneStore(out, store) {
  if (typeof store.clappers !== 'undefined') {
    let result = out.clappers ?? {};
    for (const key of Object.keys(store.clappers)) {
      let next = store.clappers[key];
      let prev = out.clappers?.[key];
      if (!prev) {
        prev = createClapper(key);
      }
      let cloned = cloneClapper(prev, next);
      result[cloned.clapperId] = cloned;
    }
    out.clappers = result;
  }
  return /** @type {Store} */ (out);
}

/**
 * @param {Partial<Clapper>} out
 * @param {Partial<Clapper>} clapper
 */
export function cloneClapper(out, clapper) {
  if (typeof clapper.clapperId !== 'undefined') {
    out.clapperId = clapper.clapperId;
  }
  if (typeof clapper.claps !== 'undefined') {
    let result = out.claps ?? {};
    for (const key of Object.keys(clapper.claps)) {
      let next = clapper.claps[key];
      let prev = out.claps?.[key];
      if (!prev) {
        prev = createClap(key);
      }
      let cloned = cloneClap(prev, next);
      result[cloned.clapId] = cloned;
    }
    out.claps = result;
  }
  if (typeof clapper.details !== 'undefined') {
    // TODO: Quick copy.
    out.details = {
      ...(out.details ?? {}),
      ...clapper.details,
    };
  }
  if (typeof clapper.shotHashes !== 'undefined') {
    let result = out.shotHashes ?? {};
    for (const key of Object.keys(clapper.shotHashes)) {
      let next = clapper.shotHashes[key];
      let prev = out.shotHashes?.[key];
      if (!prev) {
        prev = createShotHash(key);
      }
      let cloned = cloneShotHash(prev, next);
      result[cloned.shotHashId] = cloned;
    }
    out.shotHashes = result;
  }
  if (typeof clapper.shotHashStrings !== 'undefined') {
    out.shotHashStrings = {
      ...(out.shotHashStrings ?? {}),
      ...clapper.shotHashStrings,
    };
  }
  return /** @type {Clapper} */ (out);
}

/**
 * @param {Partial<Clap>} out
 * @param {Partial<Clap>} clap
 */
export function cloneClap(out, clap) {
  slowShallowCopyObjects(out, clap);
  return /** @type {Clap} */ (out);
}

/**
 * @param {Partial<ShotHash>} out
 * @param {Partial<ShotHash>} shotHash
 */
export function cloneShotHash(out, shotHash) {
  if (typeof shotHash.clapIds !== 'undefined') {
    out.clapIds = (shotHash.clapIds ?? []).slice();
  }
  if (typeof shotHash.shotHashId !== 'undefined') {
    out.shotHashId = shotHash.shotHashId;
  }
  if (typeof shotHash.sceneNumber !== 'undefined') {
    out.sceneNumber = shotHash.sceneNumber;
  }
  if (typeof shotHash.shotNumber !== 'undefined') {
    out.shotNumber = shotHash.shotNumber;
  }
  if (typeof shotHash.nextTakeNumber !== 'undefined') {
    out.nextTakeNumber = shotHash.nextTakeNumber;
  }
  if (typeof shotHash.string !== 'undefined') {
    out.string = shotHash.string;
  }
  return /** @type {ShotHash} */ (out);
}
