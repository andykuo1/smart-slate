import { slowShallowCopyObjects } from '@/utils/ObjectCopy';
import { uuid } from '@/utils/uuid';

/** @typedef {ReturnType<createStore>} Store */
/** @typedef {ReturnType<createClapper>} Clapper */
/** @typedef {ReturnType<createClap>} Clap */
/** @typedef {ReturnType<createClapperDetails>} ClapperDetails */
/** @typedef {ReturnType<createSlate>} Slate */

/** @typedef {string} ClapperId */
/** @typedef {string} ClapId */
/** @typedef {string} SlateId */

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
    firstCreatedMillis: 0,
    lastUpdatedMillis: 0,
    lastDeletedMillis: 0,
    lastExportedMillis: 0,
    details: createClapperDetails(),
    /** @type {Record<ClapId, Clap>} */
    claps: {},
    /** @type {Record<SlateId, Slate>} */
    slates: {},
    /** @type {Record<string, SlateId>} */
    shotHashes: {},
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

export function createSlate(slateId = uuid()) {
  return {
    slateId,
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
  if (typeof clapper.slates !== 'undefined') {
    let result = out.slates ?? {};
    for (const key of Object.keys(clapper.slates)) {
      let next = clapper.slates[key];
      let prev = out.slates?.[key];
      if (!prev) {
        prev = createSlate(key);
      }
      let cloned = cloneSlate(prev, next);
      result[cloned.slateId] = cloned;
    }
    out.slates = result;
  }
  if (typeof clapper.shotHashes !== 'undefined') {
    out.shotHashes = {
      ...(out.shotHashes ?? {}),
      ...clapper.shotHashes,
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
 * @param {Partial<Slate>} out
 * @param {Partial<Slate>} slate
 */
export function cloneSlate(out, slate) {
  if (typeof slate.clapIds !== 'undefined') {
    out.clapIds = (slate.clapIds ?? []).slice();
  }
  if (typeof slate.slateId !== 'undefined') {
    out.slateId = slate.slateId;
  }
  if (typeof slate.sceneNumber !== 'undefined') {
    out.sceneNumber = slate.sceneNumber;
  }
  if (typeof slate.shotNumber !== 'undefined') {
    out.shotNumber = slate.shotNumber;
  }
  if (typeof slate.nextTakeNumber !== 'undefined') {
    out.nextTakeNumber = slate.nextTakeNumber;
  }
  if (typeof slate.string !== 'undefined') {
    out.string = slate.string;
  }
  return /** @type {Slate} */ (out);
}
