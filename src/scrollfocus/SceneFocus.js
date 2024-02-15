/**
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getSceneFocusId(sceneId) {
  return `sceneFocus-${sceneId}`;
}

/**
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function scrollSceneFocusIntoView(sceneId) {
  let id = getSceneFocusId(sceneId);
  let element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
}
