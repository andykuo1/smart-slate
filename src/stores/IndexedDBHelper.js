/**
 * @param {string} name
 * @param {number} version
 * @param {(db: IDBDatabase, prev: number, next: number|null) => void} onUpgradeNeeded
 * @returns {Promise<IDBDatabase>}
 */
export async function openIndexedDB(name, version, onUpgradeNeeded) {
  if (!isIndexedDBSupported()) {
    throw new Error(
      'Unsupported environment - window or window.indexeddb is missing.',
    );
  }
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, version);
    request.addEventListener('success', (e) => {
      const target = /** @type {IDBOpenDBRequest} */ (e.target);
      const db = target.result;
      resolve(db);
    });
    request.addEventListener('error', (e) => {
      const target = /** @type {IDBOpenDBRequest} */ (e.target);
      const errorCode = target.error;
      reject(new Error('IndexedDB error code: ' + errorCode));
    });
    request.addEventListener('upgradeneeded', (e) => {
      const target = /** @type {IDBOpenDBRequest} */ (e.target);
      if (!target) {
        return;
      }
      const db = target.result;
      onUpgradeNeeded(db, e.oldVersion, e.newVersion);
    });
  });
}

/**
 * @param {string} name
 */
export async function deleteIndexedDB(name) {
  if (!isIndexedDBSupported()) {
    throw new Error(
      'Unsupported environment - window or window.indexeddb is missing.',
    );
  }
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.deleteDatabase(name);
    request.addEventListener('success', (e) => {
      const target = /** @type {IDBRequest} */ (e.target);
      const db = target.result;
      resolve(db);
    });
    request.addEventListener('error', (e) => {
      const target = /** @type {IDBRequest} */ (e.target);
      const errorCode = target.error;
      reject(new Error('IndexedDB error code: ' + errorCode));
    });
  });
}

export function isIndexedDBSupported() {
  return window && window.indexedDB;
}
