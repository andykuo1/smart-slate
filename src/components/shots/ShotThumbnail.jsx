import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import { useShotTakeCount } from '@/stores/document/use';
import PopoverStyle from '@/styles/Popover.module.css';

import ShotOptions from './options/ShotOptions';
import ShotThumbnailImage from './options/ShotThumbnailImage';

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
  return (
    <div
      className={
        'relative flex items-center border border-black' + ' ' + className
      }>
      <ShotTakeCountAsPips documentId={documentId} shotId={shotId} />
      <PopoverProvider>
        <ShotThumbnailImage
          className={'flex-1 bg-gray-300'}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          referenceOnly={referenceOnly}
        />
        <PopoverDisclosure
          className="absolute left-0 top-0 bottom-0 right-0"
          disabled={!editable}
        />
        <Popover className={PopoverStyle.popover} modal={true}>
          <PopoverArrow className={PopoverStyle.arrow} />
          <ShotOptions
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
          />
        </Popover>
      </PopoverProvider>
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function ShotTakeCountAsPips({ documentId, shotId }) {
  const takeCount = useShotTakeCount(documentId, shotId);
  if (takeCount <= 0) {
    return null;
  }
  return (
    <div
      className={
        'absolute -bottom-2 -left-2 z-10 text-xs px-1 rounded bg-white text-black'
      }>
      {'■'.repeat(Math.min(takeCount, 3))}
      {takeCount > 3 ? '...' : ''}
    </div>
  );
}
