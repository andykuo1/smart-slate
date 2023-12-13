/**
 * @param {string} str
 * @returns {string}
 */
export function camelToSnakeCase(str) {
  return str
    .replace(/([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g, function (_, a, b) {
      return a + (b && '_' + b);
    })
    .toLowerCase();
}

/**
 * @param {string} str
 */
export function wordToSnakeCase(str) {
  return str
    .replace(/\s+/g, function (_, a, b) {
      return a + (b && '_' + b);
    })
    .toLowerCase();
}
