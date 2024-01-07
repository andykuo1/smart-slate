import ShotTypes, { ANY_SHOT } from '@/stores/ShotTypes';

/**
 * @param {string} documentTitle
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {number} takeNumber
 * @param {import('@/stores/document/DocumentStore').ShotType} [shotType]
 */
export function formatTakeNameForFileExport(
  documentTitle,
  sceneNumber,
  shotNumber,
  takeNumber,
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
  const takePathHash = getTakePathNumberHash(
    documentTitle,
    sceneNumber,
    shotNumber,
    takeNumber,
  );
  const [first, second, third, fourth] = getTakePathStrings(
    documentTitle,
    sceneNumber,
    shotNumber,
    takeNumber,
  );
  const shotTypeString = formatShotType(shotType);
  return (
    `${takePathHash}_${first}_${second}${third}_${fourth}` +
    (shotTypeString ? `_${shotTypeString}` : '')
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').ShotType|undefined} shotType
 */
export function formatShotType(shotType) {
  if (!shotType || shotType === ANY_SHOT.value) {
    return '';
  }
  return ShotTypes.getParamsByType(shotType).abbr;
}

/**
 * @param {string} documentTitle
 */
export function formatDocumentTitle(documentTitle) {
  let result = documentTitle?.trim();
  if (!result) {
    // NOTE: Title was empty.
    return 'UNTITLED';
  }
  result = documentTitle.replace(/\s+/, '_');
  result = documentTitle.replace(/[^\w\d_]/, '-');
  return result.toUpperCase();
}

/**
 * @param {string|undefined} documentTitle
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {number} takeNumber
 */
export function getTakePathNumberHash(
  documentTitle,
  sceneNumber,
  shotNumber,
  takeNumber,
) {
  const documentTitleParts = documentTitle?.split(' ') || [];
  const documentLongestPart = longestString(documentTitleParts) || 'U';
  const documentChar = documentLongestPart.charAt(0).toUpperCase();
  const sceneDigits = String(Math.min(99, Math.max(0, sceneNumber)))
    .padStart(2, '0') // If less then 2 digits, pad with 0
    .substring(0, 2); // If more than 2 digits, contract it
  const shotDigits = String(Math.min(99, Math.max(0, shotNumber)))
    .padStart(2, '0') // If less then 2 digits, pad with 0
    .substring(0, 2); // If more than 2 digits, contract it
  const takeDigits = String(Math.min(99, Math.max(0, takeNumber)))
    .padStart(2, '0') // If less then 2 digits, pad with 0
    .substring(0, 2); // If more than 2 digits, contract it
  return `${documentChar}${sceneDigits}${shotDigits}${takeDigits}`;
}

/**
 * @param {string} documentTitle
 * @param {number} sceneNumber
 * @param {number} shotNumber
 * @param {number} takeNumber
 */
export function getTakePathStrings(
  documentTitle,
  sceneNumber,
  shotNumber,
  takeNumber,
) {
  return [
    formatDocumentTitle(documentTitle),
    `S${sceneNumber > 0 ? String(sceneNumber).padStart(2, '0') : '--'}`,
    shotNumber > 0 ? numToChar(shotNumber) : '-',
    `T${takeNumber > 0 ? String(takeNumber).padStart(2, '0') : '--'}`,
  ];
}

/**
 * @param {number} num
 */
export function numToChar(num) {
  if (!Number.isFinite(num)) {
    return '-';
  }
  return String.fromCharCode('A'.charCodeAt(0) + (num - 1));
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
