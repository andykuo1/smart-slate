/**
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function getShotFocusId(shotId) {
  return `shotFocus-${shotId}`;
}

/**
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function scrollShotFocusIntoView(shotId) {
  let id = getShotFocusId(shotId);
  let element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ block: 'center', behavior: 'instant' });
  }
}
