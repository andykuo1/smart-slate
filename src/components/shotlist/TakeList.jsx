import { Fragment, useEffect, useState } from 'react';

import { useGAPITokenHandler } from '@/lib/googleapi';
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
  const [cloudExportable, setCloudExportable] = useState(false);
  const handleToken = useGAPITokenHandler();

  useEffect(() => {
    if (!handleToken((token) => setCloudExportable(Boolean(token)))) {
      setCloudExportable(false);
    }
  }, [handleToken, setCloudExportable]);

  return (
    <ul>
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
              cloudExportable={cloudExportable}
            />
          </Fragment>
        ))}
    </ul>
  );
}
