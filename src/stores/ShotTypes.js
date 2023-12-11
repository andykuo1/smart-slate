/** @typedef {ReturnType<createShotTypeParams>} ShotTypeParams */

/**
 * @param {string} name
 * @param {string} abbr
 * @param {import('./DocumentStore').ShotType} value
 */
function createShotTypeParams(name, abbr, value) {
  return {
    name,
    abbr,
    value,
  };
}

export const ANY_SHOT = createShotTypeParams('Any Shot', '--', '');
export const WIDE_SHOT = createShotTypeParams('Wide Shot', 'WS', 'wide');
export const MEDIUM_SHOT = createShotTypeParams('Medium Shot', 'MS', 'medium');
export const CLOSE_UP = createShotTypeParams('Close Up', 'CU', 'closeup');
export const FULL_SHOT = createShotTypeParams('Full Shot', 'FS', 'full');
export const LONG_SHOT = createShotTypeParams('Long Shot', 'LS', 'long');

const PARAMS = [
  ANY_SHOT,
  WIDE_SHOT,
  MEDIUM_SHOT,
  CLOSE_UP,
  FULL_SHOT,
  LONG_SHOT,
];
const VALUES = PARAMS.map((param) => param.value);
const PARAM_BY_VALUES = PARAMS.reduce((prev, curr) => {
  prev[curr.value] = curr;
  return prev;
}, /** @type {Record<import('./DocumentStore').ShotType, ShotTypeParams>} */ ({}));

function values() {
  return VALUES;
}

function params() {
  return PARAMS;
}

/**
 * @param {import('./DocumentStore').ShotType} value
 */
function getParamsByType(value) {
  return PARAM_BY_VALUES[value];
}

export default {
  values,
  params,
  getParamsByType,
};
