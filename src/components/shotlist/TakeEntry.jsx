import { useCallback, useState } from 'react';

import CachedIcon from '@material-symbols/svg-400/rounded/cached.svg';
import CloudDoneIcon from '@material-symbols/svg-400/rounded/cloud_done.svg';
import CloudUploadIcon from '@material-symbols/svg-400/rounded/cloud_upload-fill.svg';

import { useInterval } from '@/lib/UseInterval';
import {
  useShotTakeCount,
  useTake,
  useTakeNumber,
} from '@/stores/DocumentStoreContext';
import { getVideoBlob, hasVideoBlob } from '@/stores/VideoCache';

import { useTakeExporter } from '../recorder/UseTakeExporter';
import BoxDrawingCharacter from './BoxDrawingCharacter';
import { getShotTypeColor } from './ShotEntry';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 * @param {boolean} props.cloudExportable
 */
export function TakeEntry({
  documentId,
  sceneId,
  shotId,
  takeId,
  cloudExportable,
}) {
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  const take = useTake(documentId, takeId);
  const exportTake = useTakeExporter();
  const [isCached, setIsCached] = useState(false);

  function onCloudClick() {
    const blob = getVideoBlob(takeId);
    if (blob) {
      exportTake(blob, documentId, sceneId, shotId, { uploadOnly: true });
    }
  }

  const onInterval = useCallback(
    function _onInterval() {
      setIsCached(hasVideoBlob(takeId));
    },
    [setIsCached, takeId],
  );

  useInterval(onInterval, 5_000);

  return (
    <TakeLayout
      title={`Take ${takeNumber}`}
      timestamp={take.exportedMillis}
      fileName={take.exportedFileName || '--'}
      className={getShotTypeColor(take.exportedShotType)}
      firstTake={false}
      lastTake={takeNumber === 1}
      isCloudExported={!!take.exportedGoogleDriveFileId}
      isCloudExportable={cloudExportable}
      isCached={isCached}
      onCloudClick={onCloudClick}
    />
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
export function NewTake({ documentId, shotId }) {
  const takeCount = useShotTakeCount(documentId, shotId);
  const takeNumber = takeCount + 1;
  return (
    <TakeLayout
      title={`Take ${takeNumber}`}
      timestamp={0}
      fileName="--"
      firstTake={false}
      lastTake={takeNumber === 1}
    />
  );
}

/**
 * @param {object} props
 * @param {string} props.title
 * @param {number} props.timestamp
 * @param {string} props.fileName
 * @param {boolean} props.firstTake
 * @param {boolean} props.lastTake
 * @param {string} [props.className]
 * @param {boolean} [props.isCloudExported]
 * @param {boolean} [props.isCloudExportable]
 * @param {boolean} [props.isCached]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onCloudClick]
 */
function TakeLayout({
  title,
  timestamp,
  fileName,
  className,
  firstTake,
  lastTake,
  isCloudExported,
  isCloudExportable,
  isCached,
  onCloudClick,
}) {
  const isPending = timestamp <= 0;
  return (
    <li
      className={
        'flex flex-row w-full' +
        ' ' +
        'overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-none' +
        ' ' +
        className
      }>
      <div className="w-full flex-shrink-0 flex flex-row snap-start">
        <BoxDrawingCharacter
          className="ml-4 mr-2"
          depth={1}
          start={firstTake}
          end={lastTake}
        />
        <p className="whitespace-nowrap flex flex-row">
          <span className={isPending ? 'opacity-30' : ''}>{title}</span>
        </p>
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
      <div className="w-full flex-shrink-0 flex flex-row snap-start">
        <p className="flex-1 opacity-30 overflow-x-auto text-center">
          {fileName}
        </p>
      </div>
    </li>
  );
}
