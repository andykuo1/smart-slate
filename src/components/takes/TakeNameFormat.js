/**
 * @param {string} projectId
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {number} takeNumber
 * @param {string} shotHash
 * @param {string} [shotType]
 */
export function formatTakeNameForFileExport(
  projectId,
  sceneNumber,
  shotNumber,
  takeNumber,
  shotHash,
  shotType,
) {
  if (sceneNumber <= 0) {
    throw new Error('Invalid scene number - must be greater than 0.');
  }
  if (sceneNumber > 99) {
    throw new Error('Invalid scene number - must be less than 100.');
  }
  if (shotNumber <= 0) {
    throw new Error('Invalid shot number - must be greater than 0.');
  }
  if (shotNumber > 99) {
    throw new Error('Invalid shot number - must be less than 100.');
  }
  if (takeNumber <= 0) {
    throw new Error('Invalid take number - must be greater than 0.');
  }
  if (takeNumber > 99) {
    throw new Error('Invalid take number - must be less than 100.');
  }
  const takePathStrings = getTakePathStrings(
    projectId,
    sceneNumber,
    shotNumber,
    takeNumber,
  );
  return (
    takePathStrings.join('_') +
    (shotType ? `_${shotType}` : '') +
    `_${shotHash}`
  );
}

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
  return result.toUpperCase();
}

/**
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {boolean} [abbreviated]
 */
export function formatSceneShotNumber(
  sceneNumber,
  shotNumber,
  abbreviated = false,
) {
  const sceneString = sceneNumber > 0 ? String(sceneNumber) : '--';
  const shotString = formatShotNumber(shotNumber);
  if (abbreviated) {
    return `${sceneString}${shotString}`;
  }
  return `S${sceneString.padStart(2, '0')}${shotString}`;
}

/**
 * @param {number} sceneNumber
 */
export function formatSceneNumber(sceneNumber) {
  return sceneNumber > 0 ? String(sceneNumber).padStart(2, '0') : '--';
}

/**
 * @param {number} shotNumber
 */
export function formatShotNumber(shotNumber) {
  return shotNumber >= 0 ? numToChar(shotNumber) : '-';
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
 * @param {string} projectId
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {number} takeNumber
 */
export function getTakePathStrings(
  projectId,
  sceneNumber,
  shotNumber,
  takeNumber,
) {
  return [
    formatProjectId(projectId),
    formatSceneShotNumber(sceneNumber, shotNumber),
    formatTakeNumber(takeNumber),
  ];
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
  return result + String.fromCharCode('A'.charCodeAt(0) + (num - 1));
}
