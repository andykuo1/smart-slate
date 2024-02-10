import { scrollSceneFocusIntoView } from '../scenes/SceneFocus';

/**
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function getShotFocusId(shotId) {
  return `shotFocus-${shotId}`;
}

/**
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function getShotFocusIdForDrawer(shotId) {
  return `shotFocus-${shotId}-drawer`;
}

/**
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function scrollShotFocusIntoView(sceneId, shotId) {
  let id = getShotFocusId(shotId);
  let drawerId = getShotFocusIdForDrawer(shotId);
  let element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ block: 'center', behavior: 'instant' });
  } else {
    // Try scene first.
    scrollSceneFocusIntoView(sceneId);
  }
  let drawerElement = document.getElementById(drawerId);
  if (drawerElement) {
    drawerElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}
