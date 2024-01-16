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
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function getTakeIdsInOrder(store, documentId, shotId) {
  return getShotById(store, documentId, shotId)?.takeIds || [];
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export function getTakeNumber(store, documentId, shotId, takeId) {
  let index = Number(
    getShotById(store, documentId, shotId)?.takeIds?.indexOf?.(takeId),
  );
  if (index < 0) {
    return -1;
  }
  return index + 1;
}
