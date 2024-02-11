import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import CheckBoxFillIcon from '@material-symbols/svg-400/rounded/check_box-fill.svg';
import CheckBoxIcon from '@material-symbols/svg-400/rounded/check_box.svg';

import { getShotById, getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
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
        'relative flex items-center border border-black text-black' +
        ' ' +
        className
      }>
      <ShotTakeCountAsCheck documentId={documentId} shotId={shotId} />
      <PopoverProvider>
        <ShotThumbnailImage
          className={'flex-1 bg-gray-300'}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          referenceOnly={referenceOnly}
        />
        <PopoverDisclosure
          className="absolute bottom-0 left-0 right-0 top-0"
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
function ShotTakeCountAsCheck({ documentId, shotId }) {
  const shotHasGoodTake = useDocumentStore((ctx) =>
    getShotById(ctx, documentId, shotId)?.takeIds?.reduceRight?.(
      (prev, takeId) =>
        prev || getTakeById(ctx, documentId, takeId)?.rating > 0,
      false,
    ),
  );
  const shotHasTakes = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.takeIds?.length > 0,
  );
  return (
    <div className="absolute bottom-0 left-0 z-10">
      {shotHasGoodTake ? (
        <CheckBoxFillIcon className="h-6 w-6 fill-current" />
      ) : shotHasTakes ? (
        <CheckBoxIcon className="h-6 w-6 fill-current" />
      ) : null}
    </div>
  );
}
