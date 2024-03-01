import { useShallow } from 'zustand/react/shallow';

import { useClapperStore } from './ClapperStore';
import {
  getClapById,
  getClapperById,
  getClapperDetailsById,
  getShotHashById,
} from './GetClapper';

/**
 * @param {import('./Store').ClapperId} clapperId
 */
export function useClapIds(clapperId) {
  return useClapperStore(
    useShallow((ctx) => Object.keys(getClapperById(ctx, clapperId)?.claps)),
  );
}

/**
 * @param {import('./Store').ClapperId} clapperId
 * @param {number} sceneNumber
 * @param {number} shotNumber
 */
export function useClapperKnownShotHash(clapperId, sceneNumber, shotNumber) {
  return useClapperStore(
    (ctx) =>
      getClapperById(ctx, clapperId)?.shotHashes[sceneNumber + '.' + shotNumber]
        ?.string ?? '----',
  );
}

/**
 * @param {import('./Store').ClapperId} clapperId
 * @param {number} sceneNumber
 * @param {number} shotNumber
 */
export function useClapperNextTakeNumber(clapperId, sceneNumber, shotNumber) {
  return useClapperStore(
    (ctx) =>
      getShotHashById(ctx, clapperId, sceneNumber + '.' + shotNumber)
        ?.nextTakeNumber ?? 1,
  );
}

/**
 * @param {import('./Store').ClapperId} clapperId
 */
export function useClapperProductionTitle(clapperId) {
  return useClapperStore(
    (ctx) => getClapperDetailsById(ctx, clapperId)?.productionTitle ?? '',
  );
}

/**
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ClapId} clapId
 */
export function useClapRollName(clapperId, clapId) {
  return useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.rollName ?? '',
  );
}

/**
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ClapId} clapId
 */
export function useClapPrintRating(clapperId, clapId) {
  return useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.printRating ?? 0,
  );
}

/**
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ClapId} clapId
 */
export function useClapComments(clapperId, clapId) {
  return useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.comments ?? '',
  );
}

/**
 * @param {import('./Store').ClapperId} clapperId
 * @param {import('./Store').ClapId} clapId
 */
export function useClapQRCodeKey(clapperId, clapId) {
  return useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.qrCodeKey ?? '',
  );
}
