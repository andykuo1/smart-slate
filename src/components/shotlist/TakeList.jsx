import { Fragment } from 'react';

import { useTakeIds } from '@/stores/DocumentStoreContext';

import { NewTake, TakeEntry } from './TakeEntry';

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
      {takeIds
        .slice()
        .reverse()
        .map((takeId) => (
          <Fragment key={`take-${takeId}`}>
            <TakeEntry
              documentId={documentId}
              sceneId={sceneId}
              shotId={shotId}
              takeId={takeId}
            />
          </Fragment>
        ))}
    </ul>
  );
}
