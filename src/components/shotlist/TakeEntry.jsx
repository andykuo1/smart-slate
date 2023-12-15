import {
  useShotTakeCount,
  useTake,
  useTakeNumber,
} from '@/stores/DocumentStoreContext';

import { getShotTypeColor } from './ShotEntry';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 */
export function TakeEntry({ documentId, sceneId, shotId, takeId }) {
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  const take = useTake(documentId, takeId);
  return (
    <TakeLayout
      title={`Take ${takeNumber}`}
      timestamp={take.exportedMillis}
      fileName={take.exportedFileName || '--'}
      className={getShotTypeColor(take.exportedShotType)}
    />
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
export function NewTake({ documentId, shotId }) {
  const takeNumber = useShotTakeCount(documentId, shotId) + 1;
  return (
    <TakeLayout title={`Take ${takeNumber}`} timestamp={0} fileName="--" />
  );
}

/**
 * @param {object} props
 * @param {string} props.title
 * @param {number} props.timestamp
 * @param {string} props.fileName
 * @param {string} [props.className]
 */
function TakeLayout({ title, timestamp, fileName, className }) {
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
        <p className={isPending ? 'opacity-30' : 'whitespace-nowrap'}>
          {title}
        </p>
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
