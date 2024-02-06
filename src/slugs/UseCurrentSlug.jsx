import { useSlug } from './UseSlug';

export function useCurrentSlug() {
  const { currentSlug } = useSlug();
  return currentSlug;
}

/** @returns {import('@/stores/document/DocumentStore').DocumentId} */
export function useCurrentDocumentId() {
  const { currentSlug } = useSlug();
  return currentSlug.documentId;
}

/** @returns {import('@/stores/document/DocumentStore').SceneId} */
export function useCurrentSceneId() {
  const { currentSlug } = useSlug();
  return currentSlug.sceneId;
}

/** @returns {import('@/stores/document/DocumentStore').ShotId} */
export function useCurrentShotId() {
  const { currentSlug } = useSlug();
  return currentSlug.shotId;
}

/** @returns {import('@/stores/document/DocumentStore').TakeId} */
export function useCurrentTakeId() {
  const { currentSlug } = useSlug();
  return currentSlug.takeId;
}
