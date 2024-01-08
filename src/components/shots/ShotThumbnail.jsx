import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import ImageWithCaption from '@/libs/ImageWithCaption';
import {
  useBestTakeImageForShotThumbnail,
  useSceneNumber,
  useShotNumber,
} from '@/stores/document';
import PopoverStyle from '@/styles/Popover.module.css';

import { formatSceneShotNumber } from '../takes/TakeNameFormat';
import ShotThumbnailOptions from './ShotThumbnailOptions';
import { ShotTypeSelector, getShotTypeIcon } from './ShotTypeSelector';
import { useShotTypeChange } from './UseShotType';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} [props.editable]
 * @param {boolean} [props.referenceOnly]
 */
export default function ShotThumbnail({
  className,
  documentId,
  sceneId,
  shotId,
  editable = false,
  referenceOnly = false,
}) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const [activeShotType, onShotTypeChange] = useShotTypeChange(
    documentId,
    shotId,
  );

  return (
    <div
      className={
        'relative flex items-center border border-black' + ' ' + className
      }>
      <PopoverProvider>
        <ShotThumbnailImage
          className={'flex-1 bg-gray-300'}
          documentId={documentId}
          shotId={shotId}
          alt={formatSceneShotNumber(sceneNumber, shotNumber, true)}
          Icon={getShotTypeIcon(activeShotType)}
          referenceOnly={referenceOnly}
        />
        <PopoverDisclosure
          className="absolute left-0 top-0 bottom-0 right-0"
          disabled={!editable}
        />
        <Popover className={PopoverStyle.popover} modal={true}>
          <PopoverArrow className={PopoverStyle.arrow} />
          <div className="flex flex-row gap-4">
            <ShotTypeSelector
              className="flex-1 flex flex-col items-center"
              activeShotType={activeShotType}
              onChange={onShotTypeChange}
            />
            <ShotThumbnailOptions documentId={documentId} shotId={shotId} />
          </div>
        </Popover>
      </PopoverProvider>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.alt
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} [props.referenceOnly]
 * @param {import('react').FC<any>} [props.Icon]
 */
function ShotThumbnailImage({
  className,
  alt,
  documentId,
  shotId,
  Icon,
  referenceOnly,
}) {
  const image = useBestTakeImageForShotThumbnail(
    documentId,
    shotId,
    referenceOnly,
  );
  return (
    <ImageWithCaption
      src={image}
      alt={alt}
      className={'max-w-sm w-[128px] h-[72px]' + ' ' + className}
      usage="add"
      Icon={Icon}
    />
  );
}
