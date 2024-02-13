/**
 * @param {string} fileName
 */
export function dirname(fileName) {
  const index = fileName.lastIndexOf('/');
  if (index >= 0) {
    return fileName.substring(0, index);
  }
  return fileName;
}

/**
 * @param {string} fileName
 */
export function basename(fileName) {
  const index = fileName.lastIndexOf('.');
  const startIndex = fileName.lastIndexOf('/');
  if (index >= 0) {
    return fileName.substring(Math.max(startIndex, 0), index);
  }
  return fileName;
}

/**
 * @param {string} fileName
 */
export function extname(fileName) {
  const index = fileName.lastIndexOf('.');
  if (index < 0) {
    return '';
  }
  return fileName.substring(index);
}
