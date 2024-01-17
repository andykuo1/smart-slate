/**
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 * @returns {IDBValidKey}
 */
export function getIDBKeyFromTakeId(takeId) {
  return takeId;
}

/**
 * @param {IDBValidKey} idbKey
 * @returns {import('@/stores/document/DocumentStore').TakeId}
 */
export function getTakeIdFromIDBKey(idbKey) {
  return String(idbKey);
}
