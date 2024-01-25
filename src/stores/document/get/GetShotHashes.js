import { getDocumentById } from './GetDocuments';

export const MAX_SHOT_HASH_RANGE = 9999;
export const SHOT_HASH_PATTERN = /^\d\d\d\d$/;

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export function findNextAvailableShotHash(store, documentId) {
  let document = getDocumentById(store, documentId);
  if (document.shotHashes.length >= MAX_SHOT_HASH_RANGE) {
    throw new Error('Out of available shot hashes.');
  }
  let hash = Math.floor(Math.random() * MAX_SHOT_HASH_RANGE) + 1;
  let result = String(hash).padStart(4, '0');
  while (document.shotHashes.includes(result)) {
    hash = (hash + 1) % (MAX_SHOT_HASH_RANGE + 1);
    if (hash <= 0) {
      hash = 1;
    }
    result = String(hash).padStart(4, '0');
  }
  return result;
}
