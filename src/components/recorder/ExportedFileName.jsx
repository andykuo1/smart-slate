import { toScenShotTakeType } from '@/stores/DocumentStore';
import {
  useDocumentTitle,
  useSceneNumber,
  useShotNumber,
  useShotTakeCount,
  useShotType,
  useTakeNumber,
} from '@/stores/DocumentStoreContext';
import { ANY_SHOT } from '@/stores/ShotTypes';
import { useCurrentCursor } from '@/stores/UserStoreContext';

/**
 * @param {import('@/stores/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/DocumentStore').ShotId} shotId
 * @param {import('@/stores/DocumentStore').TakeId} takeId
 */
export function useExportedFileName(documentId, sceneId, shotId, takeId) {
  const documentTitle = useDocumentTitle(documentId) || 'Untitled';
  // TODO: What if documentTitle changes? Should we use this hash?
  /*
  const documentName =
    documentTitle.charAt(0).toUpperCase() + documentId.substring(0, 4);
  */
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  const shotType = useShotType(documentId, shotId);
  const [scen, shot, take, type] = toScenShotTakeType(
    sceneNumber,
    shotNumber,
    takeNumber,
    shotType,
  );
  return (
    `${documentTitle}_${scen}${shot}_${take}` +
    (shotType !== ANY_SHOT.value ? `_${type}` : '')
  );
}

export function useNextAvailableExportedFileName() {
  const { documentId, sceneId, shotId } = useCurrentCursor();
  const documentTitle = useDocumentTitle(documentId) || 'Untitled';
  // TODO: What if documentTitle changes? Should we use this hash?
  /*
  const documentName =
    documentTitle.charAt(0).toUpperCase() + documentId.substring(0, 4);
  */
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const takeNumber = useShotTakeCount(documentId, shotId) + 1;
  const shotType = useShotType(documentId, shotId);
  const [scen, shot, take, type] = toScenShotTakeType(
    sceneNumber,
    shotNumber,
    takeNumber,
    shotType,
  );
  return (
    `${documentTitle}_${scen}${shot}_${take}` +
    (shotType !== ANY_SHOT.value ? `_${type}` : '')
  );
}
