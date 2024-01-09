import { formatShotNumber } from '@/components/takes/TakeNameFormat';
import {
  useSceneHeading,
  useShotNumber,
  useShotTakeCount,
  useTakeNumber,
} from '@/stores/document';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} [props.takeId]
 */
export default function RecorderBoothTitle({
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  const takeCount = useShotTakeCount(documentId, shotId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const [sceneHeading] = useSceneHeading(documentId, sceneId);
  const takeNumber = useTakeNumber(documentId, shotId, takeId || '');

  return (
    <>
      <span className="mx-2">{sceneHeading || 'INT/EXT. SCENE - DAY'}</span>
      <span className="flex-1" />
      <span>Shot {formatShotNumber(shotNumber)}</span>
      <span className="flex flex-row items-center mx-2">
        Take #{takeId ? takeNumber : takeCount + 1}
      </span>
    </>
  );
}
