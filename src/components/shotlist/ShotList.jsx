import { Fragment } from 'react';

import { useShotIds } from '@/stores/DocumentStoreContext';

import { NewShot, ShotEntry } from './ShotEntry';
import TakeList from './TakeList';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 */
export default function ShotList({ documentId, sceneId }) {
  const shotIds = useShotIds(documentId, sceneId);
  return (
    <ul title="Shot list">
      {shotIds.map((shotId) => (
        <Fragment key={`shot-${shotId}`}>
          <ShotEntry documentId={documentId} sceneId={sceneId} shotId={shotId}>
            <TakeList
              documentId={documentId}
              sceneId={sceneId}
              shotId={shotId}
            />
          </ShotEntry>
        </Fragment>
      ))}
      <NewShot documentId={documentId} sceneId={sceneId} />
    </ul>
  );
}
