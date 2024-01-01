import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import ImageWithCaption from '@/libs/ImageWithCaption';
import {
  useSceneNumber,
  useShotNumber,
  useShotThumbnail,
} from '@/stores/document';
import { shotNumberToChar } from '@/stores/document/DocumentStore';
import PopoverStyle from '@/styles/Popover.module.css';

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
 */
export default function ShotThumbnail({
  className,
  documentId,
  sceneId,
  shotId,
  editable = false,
}) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const sceneShotString =
    sceneNumber <= 0 || shotNumber <= 0
      ? '--'
      : `${sceneNumber}${shotNumberToChar(shotNumber)}`;
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
          alt={sceneShotString}
          Icon={getShotTypeIcon(activeShotType)}
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
 * @param {import('react').FC<any>} [props.Icon]
 */
function ShotThumbnailImage({ className, alt, documentId, shotId, Icon }) {
  const thumbnail = useShotThumbnail(documentId, shotId);
  return (
    <ImageWithCaption
      src={thumbnail}
      alt={alt}
      className={'max-w-sm w-[128px] h-[72px]' + ' ' + className}
      usage="add"
      Icon={Icon}
    />
  );
}
