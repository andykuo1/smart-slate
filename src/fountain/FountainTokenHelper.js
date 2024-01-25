/**
 * @param {import('./FountainTokenizer').FountainTokenType} type
 * @param {string} text
 * @param {boolean} forced
 * @param {import('./FountainTokenizer').FountainTokenStyle} style
 */
export function createToken(type, text, forced, style = '') {
  return {
    type: /** @type {import('./FountainTokenizer').FountainTokenType} */ (type),
    text,
    style: /** @type {import('./FountainTokenizer').FountainTokenStyle} */ (
      style
    ),
    forced,
  };
}
