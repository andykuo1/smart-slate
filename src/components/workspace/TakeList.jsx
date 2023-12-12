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
      {takeIds.map((takeId) => (
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
      <NewTake documentId={documentId} shotId={shotId} />
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
    <li className="flex flex-row">
      <p>Take {takeNumber}</p>
      <div className="flex-1" />
      <p className="opacity-30">{take.exportedFileName || '--'}</p>
      <div className="flex-1" />
      <p className="opacity-30">
        {new Date(take.lastExportedMillis).toLocaleString()}
      </p>
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function NewTake({ documentId, shotId }) {
  const takeNumber = useShotTakeCount(documentId, shotId) + 1;
  return (
    <li className="flex flex-row opacity-30">
      <p>Take {takeNumber}</p>
      <div className="flex-1" />
      <p className="opacity-30">Awaiting recording...</p>
      <div className="flex-1" />
      <p className="opacity-30">Now</p>
    </li>
  );
}
