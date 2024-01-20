import { getShotById } from './GetShots';

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export function getTakeById(store, documentId, takeId) {
  return store?.documents?.[documentId]?.takes[takeId];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export function getTakeExportDetailsById(store, documentId, takeId) {
  return store?.documents?.[documentId]?.takes?.[takeId]?.exportDetails;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function getTakeIdsInOrder(store, documentId, shotId) {
  return getShotById(store, documentId, shotId)?.takeIds || [];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function findNextAvailableTakeNumber(store, documentId, shotId) {
  let shot = getShotById(store, documentId, shotId);
  return shot?.nextTakeNumber || 1;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export function getTakeNumber(store, documentId, shotId, takeId) {
  let take = getTakeById(store, documentId, takeId);
  if (take?.takeNumber) {
    return take.takeNumber;
  }
  // NOTE: For backward compatibility
  let shot = getShotById(store, documentId, shotId);
  if (!shot) {
    return -1;
  }
  let index = Number(shot.takeIds?.indexOf?.(takeId));
  if (index < 0) {
    return -1;
  }
  return index + 1;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {number} takeNumber
 */
export function findTakeWithTakeNumber(store, documentId, shotId, takeNumber) {
  const result = getShotById(store, documentId, shotId)?.takeIds?.[
    takeNumber - 1
  ];
  if (!result) {
    return null;
  }
  return getTakeById(store, documentId, result);
}
