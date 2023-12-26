import { openIndexedDB } from '@/stores/IndexedDBHelper';

// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
// https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/

const VIDEO_CACHE_STORE_NAME = 'videoCache';
const DATABASE_REF = { current: /** @type {IDBDatabase|null} */ (null) };

export async function initVideoCache() {
  if (DATABASE_REF.current) {
    return;
  }
  DATABASE_REF.current = await openIndexedDB('smartSlate', 1, (db) => {
    if (!db.objectStoreNames.contains(VIDEO_CACHE_STORE_NAME)) {
      db.createObjectStore(VIDEO_CACHE_STORE_NAME);
    }
  });
}

export async function clearVideoCache() {
  getDatabase()
    .transaction([VIDEO_CACHE_STORE_NAME], 'readwrite')
    .objectStore(VIDEO_CACHE_STORE_NAME)
    .clear();
}

function getDatabase() {
  let result = DATABASE_REF.current;
  if (!result) {
    throw new Error('Database not yet initialized!');
  }
  return result;
}

/**
 * @param {() => IDBObjectStore} getStore
 * @param {Blob} blob
 * @param {string} key
 */
async function storeBlob(getStore, blob, key) {
  return new Promise((resolve, reject) => {
    const store = getStore();
    let request;
    try {
      request = store.put(blob, key);
    } catch (e) {
      reject(e);
      return;
    }
    request.addEventListener('error', reject);
    request.addEventListener('success', resolve);
  }).catch((e) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const store = getStore();
        const data = event.target?.result;
        let request;
        try {
          request = store.put(data, key);
        } catch (e) {
          reject(e);
          return;
        }
        request.addEventListener('error', reject);
        request.addEventListener('success', resolve);
      });
      reader.readAsDataURL(blob);
    });
  });
}

/**
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 * @param {Blob} blob
 */
export async function cacheVideoBlob(takeId, blob) {
  await storeBlob(
    () =>
      getDatabase()
        .transaction([VIDEO_CACHE_STORE_NAME], 'readwrite')
        .objectStore(VIDEO_CACHE_STORE_NAME),
    blob,
    takeId,
  );
  return takeId;
}

/**
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export async function getVideoBlob(takeId) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const t = db.transaction(VIDEO_CACHE_STORE_NAME);
    const store = t.objectStore(VIDEO_CACHE_STORE_NAME);
    const request = store.get(takeId);
    request.addEventListener('error', reject);
    request.addEventListener('success', () => resolve(request.result));
  });
}

/**
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export async function deleteVideoBlob(takeId) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const t = db.transaction(VIDEO_CACHE_STORE_NAME, 'readwrite');
    const store = t.objectStore(VIDEO_CACHE_STORE_NAME);
    const request = store.delete(takeId);
    request.addEventListener('error', reject);
    request.addEventListener('success', resolve);
  });
}
