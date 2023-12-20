import { useEffect, useState } from 'react';

/**
 * @param {string} name
 * @param {number} version
 * @returns
 */
export function useIndexedDBContextValue(name, version) {
  const [db, setDB] = useState(/** @type {IDBDatabase|null} */ (null));
  useEffect(() => {
    if (!window || !window.indexedDB) {
      return;
    }
    openIndexedDB(name, version, (db) => {})
      .then((db) => setDB(db))
      .catch((e) => console.error(e));
    return () => {
      // TODO: Close the database
    };
  }, [name, version]);
  return db;
}

/**
 * @param {string} name
 * @param {number} version
 * @param {(db: IDBDatabase) => void} onUpgradeNeeded
 * @returns {Promise<IDBDatabase>}
 */
async function openIndexedDB(name, version, onUpgradeNeeded) {
  if (!window || !window.indexedDB) {
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
      onUpgradeNeeded(db);
    });
  });
}
