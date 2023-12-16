/** @type  {Record<import('./DocumentStore').TakeId, Blob>} */
const cache = {};
const metadata = {
  accumulatedBytes: 0,
};
const MAX_CACHE_SIZE = 100;
const MAX_CACHE_BYTES_SIZE = 1_000_000_000;

/**
 * @param {import('./DocumentStore').TakeId} takeId
 * @param {Blob} blob
 */
export function cacheVideoBlob(takeId, blob) {
  const keys = Object.keys(cache);
  const length = keys.length;
  if (
    length > MAX_CACHE_SIZE ||
    metadata.accumulatedBytes >= MAX_CACHE_BYTES_SIZE
  ) {
    // If past max cache size, dump first half of keys.
    for (let i = 0; i < keys.length / 2; ++i) {
      let key = keys[i];
      let blob = cache[key];
      delete cache[key];
      metadata.accumulatedBytes -= blob.size;
    }
  }
  cache[takeId] = blob;
  metadata.accumulatedBytes += blob.size;
}

/**
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function hasVideoBlob(takeId) {
  return takeId in cache;
}

/**
 * @param {import('./DocumentStore').TakeId} takeId
 */
export function getVideoBlob(takeId) {
  return cache[takeId];
}
