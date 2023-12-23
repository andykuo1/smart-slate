import CachedIcon from '@material-symbols/svg-400/rounded/cached.svg';
import CloudDoneIcon from '@material-symbols/svg-400/rounded/cloud_done.svg';
import CloudUploadIcon from '@material-symbols/svg-400/rounded/cloud_upload-fill.svg';

import HorizontallySnappableDiv from '@/lib/HorizontallySnappableDiv';

import BoxDrawingCharacter from '../shotlist/BoxDrawingCharacter';
import TakeOptions from './TakeOptions';
import TakePreview from './TakePreview';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {number} props.timestamp
 * @param {string} props.fileName
 * @param {boolean} props.firstTake
 * @param {boolean} props.lastTake
 * @param {string} props.previewImage
 * @param {string} [props.className]
 * @param {boolean} [props.isCloudExported]
 * @param {boolean} [props.isCloudExportable]
 * @param {boolean} [props.isCached]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onCloudClick]
 */
export default function TakeLayout({
  title,
  timestamp,
  fileName,
  className,
  firstTake,
  lastTake,
  previewImage,
  isCloudExported,
  isCloudExportable,
  isCached,
  onCloudClick,
}) {
  const isPending = timestamp <= 0;
  return (
    <li className={'flex flex-row w-full bg-gray-100' + ' ' + className}>
      <div className="flex flex-row bg-gray-200">
        <BoxDrawingCharacter
          className="mx-2"
          depth={1}
          start={firstTake}
          end={lastTake}
        />
        <TakeOptions>
          <TakePreview
            className={isPending ? 'opacity-30' : ''}
            previewImage={previewImage}
            title={title}
          />
        </TakeOptions>
      </div>
      <HorizontallySnappableDiv>
        {/* PANEL 1 */}
        <>
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
        </>
        {/* PANEL 2 */}
        <>
          <p className="flex-1 opacity-30 overflow-x-auto text-center">
            {fileName}
          </p>
        </>
      </HorizontallySnappableDiv>
    </li>
  );
}
