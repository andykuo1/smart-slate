import {
  useShotTakeCount,
  useTake,
  useTakeIds,
  useTakeNumber,
} from '@/stores/DocumentStoreContext';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
export default function TakeList({ documentId, sceneId, shotId }) {
  const takeIds = useTakeIds(documentId, shotId);
  return (
    <ul className="mx-8">
      <NewTake documentId={documentId} shotId={shotId} />
      {takeIds.toReversed().map((takeId) => (
        <>
          <TakeHeader
            key={takeId}
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            takeId={takeId}
          />
        </>
      ))}
    </ul>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 */
function TakeHeader({ documentId, sceneId, shotId, takeId }) {
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  const take = useTake(documentId, takeId);
  return (
    <TakeLayout
      takeNumber={takeNumber}
      timestamp={take.lastExportedMillis}
      fileName={take.exportedFileName || '--'}
    />
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function NewTake({ documentId, shotId }) {
  const takeNumber = useShotTakeCount(documentId, shotId) + 1;
  return <TakeLayout takeNumber={takeNumber} timestamp={0} fileName="--" />;
}

/**
 * @param {object} props
 * @param {number} props.takeNumber
 * @param {number} props.timestamp
 * @param {string} props.fileName
 */
function TakeLayout({ takeNumber, timestamp, fileName }) {
  const isPending = timestamp <= 0;
  return (
    <li
      className={
        'flex flex-row w-full' +
        ' ' +
        'overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-none'
      }>
      <div className="w-full flex-shrink-0 flex flex-row snap-start">
        <p className={isPending ? 'opacity-30' : 'whitespace-nowrap'}>
          Take {takeNumber}
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
