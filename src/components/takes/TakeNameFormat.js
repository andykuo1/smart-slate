/**
 * @param {string} projectId
 * @param {string} sceneShotNumber
 * @param {number} takeNumber
 * @param {string} shotHash
 * @param {string} [shotType]
 */
export function formatTakeNameForFileExport(
  projectId,
  sceneShotNumber,
  takeNumber,
  shotHash,
  shotType,
) {
  if (takeNumber <= 0) {
    throw new Error('Invalid take number - must be greater than 0.');
  }
  if (takeNumber > 99) {
    throw new Error('Invalid take number - must be less than 100.');
  }
  return (
    [
      formatProjectId(projectId),
      formatSceneShotNumberString(sceneShotNumber),
      formatTakeNumber(takeNumber, false),
    ].join('_') +
    (shotType ? `_${shotType}` : '') +
    `_${shotHash}`
  );
}

export const MAX_PROJECT_ID_LENGTH = 16;

/**
 * @param {string} projectId
 */
export function formatProjectId(projectId) {
  let result = projectId?.trim();
  if (!result) {
    // NOTE: Title was empty.
    return 'UNTITLED';
  }
  result = result.replace(/\s+/g, '');
  result = result.replace(/[^\w\d_-]/g, '');
  result = result.toUpperCase();
  if (result.length > MAX_PROJECT_ID_LENGTH) {
    result = result.substring(0, MAX_PROJECT_ID_LENGTH);
  }
  return result;
}

/**
 * @param {Date} date
 */
export function getDefaultProjectIdByDate(date) {
  // NOTE: Use the whole alphabet :P
  return formatProjectId(
    `M${Number(Math.floor(date.getTime() / 1_000)).toString(36)}`,
  );
}

const SCENE_SHOT_NUMBER_PATTERN = /^(\d+)([A-Z]+|-)$/i;

/**
 * @param {string} sceneShotNumber
 * @param {boolean} [abbreviated]
 */
export function formatSceneShotNumberString(
  sceneShotNumber,
  abbreviated = false,
) {
  if (!sceneShotNumber || sceneShotNumber.length <= 0) {
    if (abbreviated) {
      return '0Z';
    } else {
      return '00Z';
    }
  }
  let result = SCENE_SHOT_NUMBER_PATTERN.exec(sceneShotNumber);
  if (!result) {
    return sceneShotNumber.toUpperCase();
  }
  let [_, sceneNumber, shotAlphabet] = result;
  sceneNumber = Number(sceneNumber).toString();
  shotAlphabet = shotAlphabet.toUpperCase();
  if (abbreviated) {
    return `${sceneNumber}${shotAlphabet}`;
  } else {
    return `S${sceneNumber.padStart(2, '0')}${shotAlphabet}`;
  }
}

/**
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {boolean} abbreviated
 */
export function formatSceneShotNumber(
  sceneNumber,
  shotNumber,
  abbreviated = false,
) {
  let first = formatSceneNumber(sceneNumber, abbreviated);
  let second = formatShotNumber(shotNumber);
  return formatSceneShotNumberString(`${first}${second}`, abbreviated);
}

/**
 * @param {ReturnType<formatSceneShotNumber>} sceneShotNumber
 */
export function parseSceneShotNumber(sceneShotNumber) {
  const result = SCENE_SHOT_NUMBER_PATTERN.exec(sceneShotNumber);
  if (!result) {
    return [];
  }
  const [_, sceneNumber, shotAlphabet] = result;
  const shotNumber = charToNum(shotAlphabet);
  return [Number(sceneNumber), shotNumber];
}

/**
 * @param {number} sceneNumber
 * @param {boolean} abbreviated
 */
export function formatSceneNumber(sceneNumber, abbreviated) {
  if (abbreviated) {
    return sceneNumber > 0 ? String(sceneNumber) : '0';
  } else {
    return sceneNumber > 0 ? String(sceneNumber).padStart(2, '0') : '00';
  }
}

/**
 * @param {number} shotNumber
 */
export function formatShotNumber(shotNumber) {
  return shotNumber > 0 ? numToChar(shotNumber) : 'Z';
}

/**
 * @param {number} takeNumber
 * @param {boolean} [abbreviated]
 */
export function formatTakeNumber(takeNumber, abbreviated = false) {
  if (takeNumber <= 0) {
    return '--';
  }
  if (abbreviated) {
    return String(takeNumber);
  } else {
    return `T${String(takeNumber).padStart(2, '0')}`;
  }
}

/**
 * @param {string} projectId
 */
export function findProjectIdChar(projectId) {
  let sum = 0;
  for (let i = 0; i < projectId.length; ++i) {
    sum += projectId.charCodeAt(i) - FIRST_CHAR_CODE + 1;
  }
  sum %= CHAR_CODE_RANGE;
  return String.fromCharCode(FIRST_CHAR_CODE + sum).toUpperCase();
}

/**
 * @param {string} documentTitle
 */
export function findDocumentTitleChar(documentTitle) {
  const documentTitleParts = documentTitle?.split(' ') || [];
  const documentLongestPart = longestString(documentTitleParts) || 'U';
  return documentLongestPart.charAt(0).toUpperCase();
}

/**
 * @param {Array<string>} strings
 */
export function longestString(strings) {
  if (strings.length <= 0) {
    return '';
  }
  let result = strings[0];
  let longest = result.length;
  for (let string of strings) {
    const length = string.length;
    if (string.length > longest) {
      result = string;
      longest = length;
    }
  }
  return result;
}

const FIRST_CHAR_CODE = 'A'.charCodeAt(0);
const LAST_CHAR_CODE = 'Z'.charCodeAt(0);
const CHAR_CODE_RANGE = LAST_CHAR_CODE - FIRST_CHAR_CODE + 1;

/**
 * @param {number} num
 */
export function numToChar(num) {
  if (!Number.isFinite(num)) {
    return '-';
  }
  let result = '';
  if (num > CHAR_CODE_RANGE) {
    result = numToChar(Math.floor(num / CHAR_CODE_RANGE));
    num = num % CHAR_CODE_RANGE;
  }
  return result + String.fromCharCode(FIRST_CHAR_CODE + (num - 1));
}

/**
 * @param {string} char
 */
export function charToNum(char) {
  let result = 0;
  let pow = 1;
  for (let i = char.length - 1; i >= 0; --i) {
    let c = char.charCodeAt(i);
    let code = c - FIRST_CHAR_CODE;
    if (code < 0 || code >= CHAR_CODE_RANGE) {
      continue;
    }
    // NOTE: Offset by 1 since subtraction made 'A' = 0
    result += (code + 1) * pow;
    pow *= CHAR_CODE_RANGE;
  }
  return result;
}
