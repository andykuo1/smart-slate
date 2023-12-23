import { Fragment } from 'react';

import { useShotIds } from '@/stores/DocumentStoreContext';
import { useCurrentCursor } from '@/stores/UserStoreContext';

import { NewShot, ShotEntry } from '../shots/ShotEntry';
import TakeList from '../takes/TakeList';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 */
export default function ShotList({ documentId, sceneId }) {
  const userCursor = useCurrentCursor();
  const activeShotId = userCursor.shotId;
  const hasActiveShot = Boolean(activeShotId);
  const shotIds = useShotIds(documentId, sceneId);
  return (
    <ul title="Shot list">
      {shotIds.map(
        (shotId) =>
          (!hasActiveShot || shotId === activeShotId) && (
            <Fragment key={`shot-${shotId}`}>
              <ShotEntry
                documentId={documentId}
                sceneId={sceneId}
                shotId={shotId}>
                <TakeList
                  documentId={documentId}
                  sceneId={sceneId}
                  shotId={shotId}
                />
              </ShotEntry>
            </Fragment>
          ),
      )}
      {!hasActiveShot && <NewShot documentId={documentId} sceneId={sceneId} />}
    </ul>
  );
}
