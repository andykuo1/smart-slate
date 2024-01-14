/**
 * @param {ArrayBuffer} arrayBuffer
 * @param {string} mimeType
 */
export function arrayBufferToBlob(arrayBuffer, mimeType) {
  return new Blob([arrayBuffer], { type: mimeType });
}

/**
 * NOTE: https://web.dev/articles/indexeddb-best-practices
 *
 * @param {Blob} blob
 * @returns {Promise<ArrayBuffer>}
 */
export function blobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      const result = reader.result;
      if (!result) {
        reject(new Error('FileReader result is null.'));
        return;
      }
      if (typeof result === 'string') {
        reject(
          new Error('FileReader result is a string - expected an ArrayBuffer.'),
        );
        return;
      }
      resolve(result);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(blob);
  });
}
