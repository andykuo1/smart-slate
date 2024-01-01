import CachedIcon from '@material-symbols/svg-400/rounded/cached.svg';
import CloudDoneIcon from '@material-symbols/svg-400/rounded/cloud_done.svg';
import CloudUploadIcon from '@material-symbols/svg-400/rounded/cloud_upload-fill.svg';
import StarIcon from '@material-symbols/svg-400/rounded/star-fill.svg';

import HorizontallySnappableDiv from '@/libs/HorizontallySnappableDiv';
import { useTakeRating } from '@/stores/document';

import BoxDrawingCharacter from '../documents/BoxDrawingCharacter';
import TakeOptions from './TakeOptions';
import TakePreview from './TakePreview';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {string} props.title
 * @param {number} props.timestamp
 * @param {string} props.fileName
 * @param {boolean} props.firstTake
 * @param {boolean} props.lastTake
 * @param {string} props.previewImage
 * @param {'list'|'inline'} props.viewMode
 * @param {string} [props.className]
 * @param {boolean} [props.isCloudExported]
 * @param {boolean} [props.isCloudExportable]
 * @param {boolean} [props.isCached]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onCloudClick]
 */
export default function TakeLayout({
  documentId,
  sceneId,
  shotId,
  takeId,
  title,
  timestamp,
  fileName,
  className,
  firstTake,
  lastTake,
  previewImage,
  viewMode,
  isCloudExported,
  isCloudExportable,
  isCached,
  onCloudClick,
}) {
  const rating = useTakeRating(documentId, takeId);
  const isPending = timestamp <= 0;
  const isGood = rating > 0;
  const isBad = rating < 0;
  const showListDecorations = viewMode === 'list';
  const listDecorationStyle = getListDecorationStyleByViewMode(viewMode);
  return (
    <li
      className={
        'flex flex-row bg-gray-100' +
        ' ' +
        getListItemStyleByViewMode(viewMode) +
        ' ' +
        className
      }>
      <div className="flex flex-row bg-gray-200">
        <BoxDrawingCharacter
          className={'mx-2' + ' ' + listDecorationStyle}
          depth={1}
          start={firstTake}
          end={lastTake}
        />
        <TakeOptions
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          takeId={takeId}
          showButton={showListDecorations}
          disabled={!takeId}>
          <TakePreview
            className={
              (isBad ? 'grayscale' : '') + ' ' + (isPending ? 'opacity-30' : '')
            }
            previewImage={previewImage}
            title={title}
          />
          {isGood && (
            <StarIcon className="absolute top-0 left-0 w-6 h-6 fill-yellow-500 pointer-events-none" />
          )}
        </TakeOptions>
      </div>
      <HorizontallySnappableDiv>
        {/* PANEL 1 */}
        <div className={'flex-1 flex flex-row' + ' ' + listDecorationStyle}>
          <button
            className="flex flex-row px-2"
            onClick={onCloudClick}
            disabled={isCloudExported || !isCloudExportable || !isCached}>
            {isCloudExported ? (
              <CloudDoneIcon className="w-6 h-6 fill-current" />
            ) : isCloudExportable && isCached ? (
              <CloudUploadIcon className="w-6 h-6 fill-current" />
            ) : (
              isCached && <CachedIcon className="w-6 h-6 fill-current" />
            )}
          </button>
          <div className="flex-1" />
          <p className="opacity-30 whitespace-nowrap">
            {isPending ? '--' : new Date(timestamp).toLocaleString()}
          </p>
        </div>
        {/* PANEL 2 */}
        <div className={'flex-1 flex flex-row' + ' ' + listDecorationStyle}>
          <p className="flex-1 opacity-30 overflow-x-auto text-center">
            {fileName}
          </p>
        </div>
      </HorizontallySnappableDiv>
    </li>
  );
}

/**
 * @param {string} viewMode
 */
function getListItemStyleByViewMode(viewMode) {
  switch (viewMode) {
    case 'list':
      return 'w-full';
    case 'inline':
      return '';
    default:
      throw new Error('Unknown view mode - ' + viewMode);
  }
}

/**
 * @param {string} viewMode
 */
function getListDecorationStyleByViewMode(viewMode) {
  switch (viewMode) {
    case 'list':
      return '';
    case 'inline':
      return 'hidden';
    default:
      throw new Error('Unknown view mode - ' + viewMode);
  }
}
