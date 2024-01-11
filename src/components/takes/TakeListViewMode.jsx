/**
 * @param {string} viewMode
 */
export function getListItemStyleByViewMode(viewMode) {
  switch (viewMode) {
    case 'list':
      return 'w-full';
    case 'inline':
      return '';
    default:
      throw new Error('Unknown view mode - ' + viewMode);
  }
}

/**
 * @param {string} viewMode
 */
export function getListDecorationStyleByViewMode(viewMode) {
  switch (viewMode) {
    case 'list':
      return '';
    case 'inline':
      return 'hidden';
    default:
      throw new Error('Unknown view mode - ' + viewMode);
  }
}
