import { getIDBKeyFromTakeId } from '@/stores/document/value';
import { arrayBufferToBlob, blobToArrayBuffer } from '@/utils/BlobHelper';
import { openIndexedDB, thenIDBRequest } from '@/utils/IndexedDBStorage';

import { tryMigrateVideoCacheV1ToV2 } from './VideoCacheMigrationV1';

// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
// https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/

export const DATABASE_NAME = 'smartSlate';
export const DATABASE_VERSION = 2;
export const VIDEO_CACHE_STORE_NAME = 'videoCache';
export const VIDEO_CACHE_STORE_NAME_V2 = 'videoCacheV2';
const DATABASE_REF = { current: /** @type {IDBDatabase|null} */ (null) };

/** @typedef {ReturnType<createVideoCacheEntry>} VideoCacheEntry */

function getDatabase() {
  let result = DATABASE_REF.current;
  if (!result) {
    throw new Error('Database not yet initialized!');
  }
  return result;
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 * @param {ArrayBuffer} arrayBuffer
 * @param {string} mimeType
 */
export function createVideoCacheEntry(
  documentId,
  takeId,
  arrayBuffer,
  mimeType,
) {
  return {
    documentId,
    takeId,
    arrayBuffer,
    mimeType,
  };
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 * @param {Blob} blob
 */
export async function createVideoCacheEntryFromBlob(documentId, takeId, blob) {
  const arrayBuffer = await blobToArrayBuffer(blob);
  const mimeType = blob.type;
  return createVideoCacheEntry(documentId, takeId, arrayBuffer, mimeType);
}

export async function initVideoCache() {
  if (DATABASE_REF.current) {
    return;
  }

  const request = await openIndexedDB(
    DATABASE_NAME,
    DATABASE_VERSION,
    (request, oldVersion, newVersion) => {
      console.log(
        `[VideoCache] Upgrade needed for video cache from ${oldVersion} to ${newVersion}.`,
      );
      const db = request.result;
      if (!db.objectStoreNames.contains(VIDEO_CACHE_STORE_NAME_V2)) {
        const store = db.createObjectStore(VIDEO_CACHE_STORE_NAME_V2);
        if (!store.indexNames.contains('documentId')) {
          store.createIndex('documentId', 'documentId', { unique: false });
        }
      }
    },
  );
  DATABASE_REF.current = request.result;

  if (getDatabase().objectStoreNames.contains(VIDEO_CACHE_STORE_NAME)) {
    console.log('[VideoCache] Trying to migrate the database to v2.');
    tryMigrateVideoCacheV1ToV2(getDatabase());
  }
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
export async function clearVideoCache(documentId) {
  const request = await thenIDBRequest(() =>
    getDatabase()
      .transaction([VIDEO_CACHE_STORE_NAME_V2], 'readonly')
      .objectStore(VIDEO_CACHE_STORE_NAME_V2)
      .index('documentId')
      .getAllKeys(documentId),
  );
  await Promise.all(
    request.result.map((key) =>
      thenIDBRequest(() =>
        getDatabase()
          .transaction([VIDEO_CACHE_STORE_NAME_V2], 'readwrite')
          .objectStore(VIDEO_CACHE_STORE_NAME_V2)
          .delete(key),
      ),
    ),
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 * @param {Blob} blob
 * @returns {Promise<IDBValidKey>}
 */
export async function cacheVideoBlob(documentId, takeId, blob) {
  const idbKey = getIDBKeyFromTakeId(takeId);
  const value = await createVideoCacheEntryFromBlob(documentId, takeId, blob);
  await thenIDBRequest(() =>
    getDatabase()
      .transaction([VIDEO_CACHE_STORE_NAME_V2], 'readwrite')
      .objectStore(VIDEO_CACHE_STORE_NAME_V2)
      .put(value, idbKey),
  );
  return idbKey;
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {IDBValidKey} idbKey
 * @returns {Promise<Blob|null>}
 */
export async function getVideoBlob(documentId, idbKey) {
  const request = await thenIDBRequest(
    () =>
      /** @type {IDBRequest<VideoCacheEntry|undefined>} */
      (
        getDatabase()
          .transaction([VIDEO_CACHE_STORE_NAME_V2], 'readonly')
          .objectStore(VIDEO_CACHE_STORE_NAME_V2)
          .get(idbKey)
      ),
  );
  const result = request.result;
  if (!result) {
    return null;
  }
  return arrayBufferToBlob(result.arrayBuffer, result.mimeType);
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export async function deleteVideoBlob(documentId, takeId) {
  const idbKey = getIDBKeyFromTakeId(takeId);
  await thenIDBRequest(() =>
    getDatabase()
      .transaction([VIDEO_CACHE_STORE_NAME_V2], 'readwrite')
      .objectStore(VIDEO_CACHE_STORE_NAME_V2)
      .delete(idbKey),
  );
}
