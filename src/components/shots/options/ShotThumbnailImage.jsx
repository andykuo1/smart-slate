import PhotoIcon from '@material-symbols/svg-400/rounded/photo.svg';

import ImageWithCaption from '@/libs/ImageWithCaption';
import { useSceneShotNumber } from '@/serdes/UseResolveSceneShotNumber';
import { isShotEmpty, useShotType } from '@/stores/document';
import {
  useBestTakeImageForShotThumbnail,
  useDocumentStore,
} from '@/stores/document/use';

import { getShotTypeIcon } from './ShotTypeIcon';

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
  const sceneShotNumber = useSceneShotNumber(documentId, sceneId, shotId);
  const emptyShot = useDocumentStore((ctx) =>
    isShotEmpty(ctx, documentId, shotId),
  );
  const shotType = useShotType(documentId, shotId);
  return (
    <ImageWithCaption
      src={image}
      alt="Shot reference image"
      caption={emptyShot ? `(${sceneShotNumber})` : sceneShotNumber}
      className={'h-[72px] w-[128px] max-w-sm' + ' ' + className}
      Icon={shotType ? getShotTypeIcon(shotType) : PhotoIcon}
    />
  );
}
