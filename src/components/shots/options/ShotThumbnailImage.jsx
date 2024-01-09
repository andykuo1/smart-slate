import { formatSceneShotNumber } from '@/components/takes/TakeNameFormat';
import ImageWithCaption from '@/libs/ImageWithCaption';
import {
  useBestTakeImageForShotThumbnail,
  useSceneNumber,
  useShotNumber,
  useShotType,
} from '@/stores/document';

import { getShotTypeIcon } from './ShotTypeSelector';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {string} [props.className]
 * @param {boolean} [props.referenceOnly]
 */
export default function ShotThumbnailImage({
  className,
  documentId,
  sceneId,
  shotId,
  referenceOnly,
}) {
  const image = useBestTakeImageForShotThumbnail(
    documentId,
    shotId,
    referenceOnly,
  );
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const shotType = useShotType(documentId, shotId);
  return (
    <ImageWithCaption
      src={image}
      alt="Shot reference image"
      caption={formatSceneShotNumber(sceneNumber, shotNumber, true)}
      className={'max-w-sm w-[128px] h-[72px]' + ' ' + className}
      usage="add"
      Icon={getShotTypeIcon(shotType)}
    />
  );
}
