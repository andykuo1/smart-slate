import { formatShotNumber } from '@/components/takes/TakeNameFormat';
import {
  useSceneHeading,
  useShotNumber,
  useShotTakeCount,
} from '@/stores/document';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function RecorderBoothTitle({ documentId, sceneId, shotId }) {
  const takeCount = useShotTakeCount(documentId, shotId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const [sceneHeading] = useSceneHeading(documentId, sceneId);

  return (
    <>
      <span className="mx-2">{sceneHeading || 'INT/EXT. SCENE - DAY'}</span>
      <span className="flex-1" />
      <span>Shot {formatShotNumber(shotNumber)}</span>
      <span className="flex flex-row items-center mx-2">
        Take #{takeCount + 1}
      </span>
    </>
  );
}
