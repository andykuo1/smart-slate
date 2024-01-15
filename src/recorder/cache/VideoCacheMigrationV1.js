import { findDocumentWithTakeId } from '@/stores/document';
import { getTakeIdFromIDBKey } from '@/stores/document/ExportedTakeIDBKey';
import { thenIDBRequest } from '@/utils/IndexedDBStorage';

import {
  VIDEO_CACHE_STORE_NAME,
  VIDEO_CACHE_STORE_NAME_V2,
  createVideoCacheEntryFromBlob,
} from './VideoCache';

/**
 * @param {IDBDatabase} db
 */
export async function tryMigrateVideoCacheV1ToV2(db) {
  const documentStoreString = localStorage.getItem('documentStore');
  if (!documentStoreString) {
    return;
  }
  const documentStore = JSON.parse(documentStoreString);
  const documentStoreState = documentStore?.state || {};
  const request = await thenIDBRequest(() =>
    db
      .transaction([VIDEO_CACHE_STORE_NAME], 'readonly')
      .objectStore(VIDEO_CACHE_STORE_NAME)
      .getAllKeys(),
  );
  const keys = [...request.result];
  console.log(`[VideoCache] Found '${keys.length}' keys.`);
  for (let key of keys) {
    const request = await thenIDBRequest(() =>
      db
        .transaction([VIDEO_CACHE_STORE_NAME], 'readonly')
        .objectStore(VIDEO_CACHE_STORE_NAME)
        .get(key),
    );
    const blob = request.result;
    const takeId = getTakeIdFromIDBKey(key);
    if (!takeId) {
      continue;
    }
    const document = findDocumentWithTakeId(documentStoreState, takeId);
    if (!document) {
      continue;
    }
    const entry = await createVideoCacheEntryFromBlob(
      document.documentId,
      takeId,
      blob,
    );
    await thenIDBRequest(() =>
      db
        .transaction([VIDEO_CACHE_STORE_NAME_V2], 'readwrite')
        .objectStore(VIDEO_CACHE_STORE_NAME_V2)
        .put(entry, key),
    );
    await thenIDBRequest(() =>
      db
        .transaction([VIDEO_CACHE_STORE_NAME], 'readwrite')
        .objectStore(VIDEO_CACHE_STORE_NAME)
        .delete(key),
    );
  }
}
