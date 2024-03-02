import ShotHash from '@/clapperV3/ShotHash';

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 */
export function getClapperById(store, clapperId) {
  return store.clappers?.[clapperId];
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ClapId} clapId
 */
export function getClapById(store, clapperId, clapId) {
  return store.clappers?.[clapperId]?.claps?.[clapId];
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 */
export function getClapperDetailsById(store, clapperId) {
  return getClapperById(store, clapperId)?.details;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {number} takeNumber
 */
export function findClapBySceneShotTakeNumber(
  store,
  clapperId,
  sceneNumber,
  shotNumber,
  takeNumber,
) {
  const clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return null;
  }
  for (let clap of Object.values(clapper.claps)) {
    if (
      clap.sceneNumber === sceneNumber &&
      clap.shotNumber === shotNumber &&
      clap.takeNumber === takeNumber
    ) {
      return clap;
    }
  }
  return null;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').SlateId} slateId
 */
export function getSlateById(store, clapperId, slateId) {
  return getClapperById(store, clapperId)?.slates?.[slateId];
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {number} sceneNumber
 * @param {number} shotNumber
 */
export function findSlateBySceneShotNumber(
  store,
  clapperId,
  sceneNumber,
  shotNumber,
) {
  const clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return null;
  }
  for (let slate of Object.values(clapper.slates)) {
    if (slate.sceneNumber === sceneNumber && slate.shotNumber === shotNumber) {
      return slate;
    }
  }
  return null;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {number} sceneNumber
 */
export function findLastSlateBySceneNumber(store, clapperId, sceneNumber) {
  const clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return null;
  }
  let result = null;
  for (let slate of Object.values(clapper.slates)) {
    if (
      slate.sceneNumber === sceneNumber &&
      slate.shotNumber > (result?.shotNumber ?? Number.NEGATIVE_INFINITY)
    ) {
      result = slate;
    }
  }
  return result;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {string} shotHash
 */
export function findSlateByShotHash(store, clapperId, shotHash) {
  const clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return null;
  }
  const slateId = clapper.shotHashes[shotHash];
  if (!slateId) {
    return null;
  }
  return getSlateById(store, clapperId, slateId);
}

export const MAX_SHOT_HASH_RANGE = 9999;
export const SHOT_HASH_PATTERN = /^\d\d\d\d$/;

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 */
export function findNextAvailableShotHash(store, clapperId) {
  let clapper = getClapperById(store, clapperId);
  let shotHashes = Object.keys(clapper.shotHashes);
  return ShotHash.generate(shotHashes);
}
