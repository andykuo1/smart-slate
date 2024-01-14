import { tryGetIndexedDB } from './BrowserFeatures';

/**
 * @param {string} name
 * @param {number} version
 * @param {(request: IDBOpenDBRequest, oldVersion: number, newVersion: number|null) => void} onUpgradeNeeded
 */
export async function openIndexedDB(name, version, onUpgradeNeeded) {
  return thenIDBOpenDBRequest(
    () => tryGetIndexedDB()?.open(name, version),
    onUpgradeNeeded,
  );
}

/**
 * @param {string} name
 */
export async function deleteIndexedDB(name) {
  return thenIDBRequest(() => tryGetIndexedDB()?.deleteDatabase(name));
}

export async function getIndexedDBInfos() {
  return tryGetIndexedDB()?.databases();
}

/**
 * @template T
 * @param {() => IDBRequest<T>} tryRequest
 * @returns {Promise<IDBRequest<T>>}
 */
export function thenIDBRequest(tryRequest) {
  return new Promise((resolve, reject) => {
    try {
      const request = tryRequest();
      request.addEventListener('error', (e) => {
        const target = /** @type {IDBRequest} */ (e.target);
        reject(target.error);
      });
      request.addEventListener('success', (e) => {
        const target = /** @type {IDBRequest} */ (e.target);
        resolve(target);
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @param {() => IDBOpenDBRequest} tryOpenRequest
 * @param {(request: IDBOpenDBRequest, oldVersion: number, newVersion: number|null) => void} tryUpgradeNeeded
 * @returns {Promise<IDBOpenDBRequest>}
 */
export function thenIDBOpenDBRequest(tryOpenRequest, tryUpgradeNeeded) {
  return new Promise((resolve, reject) => {
    try {
      const request = tryOpenRequest();
      request.addEventListener('error', (e) => {
        const target = /** @type {IDBOpenDBRequest} */ (e.target);
        reject(target.error);
      });
      request.addEventListener('success', (e) => {
        const target = /** @type {IDBOpenDBRequest} */ (e.target);
        resolve(target);
      });
      request.addEventListener('upgradeneeded', (e) => {
        const target = /** @type {IDBOpenDBRequest} */ (e.target);
        const newVersion = e.newVersion;
        const oldVersion = e.oldVersion;
        tryUpgradeNeeded(target, oldVersion, newVersion);
      });
      request.addEventListener('blocked', () => {
        window.alert(
          'Unable to update to new version. Please close all other tabs and reload.',
        );
        reject(new Error('IDBOpenDBRequest blocked on existing connection.'));
      });
    } catch (e) {
      reject(e);
    }
  });
}
