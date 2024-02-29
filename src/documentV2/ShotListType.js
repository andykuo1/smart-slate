/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 */
export function getULClassNameByShotListType(shotListType) {
  switch (shotListType) {
    case 'list':
      return 'grid-cols-1';
    case '':
    case 'grid':
    default:
      return 'grid-cols-[repeat(auto-fill,minmax(min(2.5in,100%),1fr))]';
  }
}

/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 */
export function getNewShotClassNameByShotListType(shotListType) {
  switch (shotListType) {
    case 'list':
      return 'mr-auto';
    case '':
    case 'grid':
    default:
      return '';
  }
}

/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 * @returns {import('./ShotListParts').ShotViewVariant}
 */
export function getShotViewVariantByShotListType(shotListType) {
  switch (shotListType) {
    case 'list':
      return 'line';
    case '':
    case 'grid':
    default:
      return 'block';
  }
}

/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 */
export function getDragDirectionByShotListType(shotListType) {
  switch (shotListType) {
    case 'list':
      return 'vertical';
    case '':
    case 'grid':
    default:
      return 'horizontal';
  }
}

/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 */
export function getShotMarginClassNameByShotListType(shotListType) {
  switch (shotListType) {
    case 'list':
      return '';
    case '':
    case 'grid':
    default:
      return 'mx-auto';
  }
}
