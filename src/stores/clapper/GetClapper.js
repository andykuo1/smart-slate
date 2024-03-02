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
 * @param {import('./Store').ShotHashId} shotHashId
 */
export function getShotHashById(store, clapperId, shotHashId) {
  return getClapperById(store, clapperId)?.shotHashes?.[shotHashId];
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {number} sceneNumber
 * @param {number} shotNumber
 */
export function findShotHashBySceneShotNumber(
  store,
  clapperId,
  sceneNumber,
  shotNumber,
) {
  const clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return null;
  }
  for (let shotHash of Object.values(clapper.shotHashes)) {
    if (
      shotHash.sceneNumber === sceneNumber &&
      shotHash.shotNumber === shotNumber
    ) {
      return shotHash;
    }
  }
  return null;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {number} sceneNumber
 */
export function findLastShotHashBySceneNumber(store, clapperId, sceneNumber) {
  const clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return null;
  }
  let result = null;
  for (let shotHash of Object.values(clapper.shotHashes)) {
    if (
      shotHash.sceneNumber === sceneNumber &&
      shotHash.shotNumber > (result?.shotNumber ?? Number.NEGATIVE_INFINITY)
    ) {
      result = shotHash;
    }
  }
  return result;
}

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 * @param {string} shotHashString
 */
export function findShotHashByShotHashString(store, clapperId, shotHashString) {
  const clapper = getClapperById(store, clapperId);
  if (!clapper) {
    return null;
  }
  const shotHashId = clapper.shotHashStrings[shotHashString];
  if (!shotHashId) {
    return null;
  }
  return getShotHashById(store, clapperId, shotHashId);
}

export const MAX_SHOT_HASH_STRING_RANGE = 9999;
export const SHOT_HASH_STRING_PATTERN = /^\d\d\d\d$/;

/**
 * @param {import('./Store').Store} store
 * @param {import('./Store').ClapperId} clapperId
 */
export function findNextAvailableShotHashString(store, clapperId) {
  let clapper = getClapperById(store, clapperId);
  let shotHashStrings = Object.keys(clapper.shotHashStrings);
  if (shotHashStrings.length >= MAX_SHOT_HASH_STRING_RANGE) {
    throw new Error('Out of available shot hashes.');
  }
  let hash = Math.floor(Math.random() * MAX_SHOT_HASH_STRING_RANGE) + 1;
  let result = String(hash).padStart(4, '0');
  while (shotHashStrings.includes(result)) {
    hash = (hash + 1) % (MAX_SHOT_HASH_STRING_RANGE + 1);
    if (hash <= 0) {
      hash = 1;
    }
    result = String(hash).padStart(4, '0');
  }
  return result;
}
