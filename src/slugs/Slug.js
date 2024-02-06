import {
  formatSceneNumber,
  formatSceneShotNumber,
  parseSceneShotNumber,
} from '@/components/takes/TakeNameFormat';

/** @typedef {ReturnType<createSlug>} Slug */
/** @typedef {ReturnType<createNominalSlug>} NominalSlug */

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export function createSlug(documentId, sceneId, shotId, takeId) {
  return {
    documentId,
    sceneId,
    shotId,
    takeId,
  };
}

/**
 * @param {any} value
 */
export function isSlug(value) {
  return typeof value === 'object' && typeof value.documentId === 'string';
}

/**
 * @param {Slug} a
 * @param {Slug} b
 */
export function compareSlugs(a, b) {
  if (a.documentId !== b.documentId) {
    return -1;
  }
  if (a.sceneId !== b.sceneId) {
    return 1;
  }
  if (a.shotId !== b.shotId) {
    return 2;
  }
  if (a.takeId !== b.takeId) {
    return 3;
  }
  return 0;
}

/**
 * @param {string} projectId
 * @param {number} sceneNum
 * @param {number} shotNum
 * @param {number} takeNum
 */
export function createNominalSlug(projectId, sceneNum, shotNum, takeNum) {
  return {
    projectId,
    sceneNum,
    shotNum,
    takeNum,
  };
}

/**
 * @param {any} value
 */
export function isNominalSlug(value) {
  return typeof value === 'object' && typeof value.projectId === 'string';
}

/**
 * @param {NominalSlug} a
 * @param {NominalSlug} b
 */
export function compareNominalSlugs(a, b) {
  if (a === b) {
    return 0;
  }

  let result = a.projectId.localeCompare(b.projectId);
  if (result !== 0) {
    return result;
  }

  let hasA = a.sceneNum > 0;
  let hasB = b.sceneNum > 0;
  if (!hasA && !hasB) {
    return 0;
  } else if (hasA && hasB) {
    result = a.sceneNum - b.sceneNum;
    if (result !== 0) {
      return result;
    }
  } else {
    return 1;
  }

  hasA = a.shotNum > 0;
  hasB = b.shotNum > 0;
  if (!hasA && !hasB) {
    return 0;
  } else if (hasA && hasB) {
    result = a.shotNum - b.shotNum;
    if (result !== 0) {
      return result;
    }
  } else {
    return 1;
  }

  hasA = a.takeNum > 0;
  hasB = b.takeNum > 0;
  if (!hasA && !hasB) {
    return 0;
  } else if (hasA && hasB) {
    result = a.takeNum - b.takeNum;
    if (result !== 0) {
      return result;
    }
  } else {
    return 1;
  }

  // It passed everything!
  return 0;
}

/**
 * @param {NominalSlug} nominalSlug
 */
export function encodeNominalSlugToSearchParams(nominalSlug) {
  const { projectId, sceneNum, shotNum, takeNum } = nominalSlug;
  let result = [];
  // projectId
  result.push(projectId);
  // sceneShot-take number
  if (sceneNum > 0) {
    if (shotNum > 0) {
      // shotNumber
      result.push(formatSceneShotNumber(sceneNum, shotNum, true));
      // takeNumber
      if (takeNum > 0) {
        result.push(String(takeNum));
      }
    } else {
      result.push(formatSceneNumber(sceneNum, true));
    }
  }
  return {
    s: result.join('-').toUpperCase(),
  };
}

/**
 * @param {URLSearchParams} searchParams
 */
export function decodeNominalSlugFromSearchParams(searchParams) {
  if (!searchParams.has('s')) {
    return null;
  }
  const value = searchParams.get('s');
  if (!value) {
    return null;
  }
  const [projectId, sceneShotNum, takeNumber, ..._remaining] = value
    .toUpperCase()
    .split('-');
  const [sceneNumber, shotNumber] = parseSceneShotNumber(sceneShotNum);
  return createNominalSlug(
    projectId,
    Number(sceneNumber),
    Number(shotNumber),
    Number(takeNumber),
  );
}
