/**
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getDocumentSceneFocusId(sceneId) {
  return `documentfocus-scene-${sceneId}`;
}

/**
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function scrollDocumentSceneFocusIntoView(sceneId) {
  let id = getDocumentSceneFocusId(sceneId);
  let element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
}
/**
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function getDrawerSceneFocusId(sceneId) {
  return `drawerfocus-scene-${sceneId}`;
}

/**
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
export function scrollDrawerSceneFocusIntoView(sceneId) {
  let id = getDrawerSceneFocusId(sceneId);
  let element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
}
