import { Fragment } from 'react';

import { useShotIds } from '@/stores/document';
import { useCurrentCursor } from '@/stores/user';

import TakeList from '../takes/TakeList';
import { NewShot, ShotEntry } from './ShotEntry';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function ShotList({ documentId, sceneId, blockId }) {
  const userCursor = useCurrentCursor();
  const activeShotId = userCursor.shotId;
  const hasActiveShot = Boolean(activeShotId);
  const shotIds = useShotIds(documentId, blockId);
  return (
    <ul title="Shot list">
      {shotIds.map(
        (shotId) =>
          (!hasActiveShot || shotId === activeShotId) && (
            <Fragment key={`shot-${shotId}`}>
              <ShotEntry
                documentId={documentId}
                sceneId={sceneId}
                blockId={blockId}
                shotId={shotId}>
                <TakeList
                  documentId={documentId}
                  sceneId={sceneId}
                  blockId={blockId}
                  shotId={shotId}
                  viewMode={hasActiveShot ? 'list' : 'inline'}
                />
              </ShotEntry>
            </Fragment>
          ),
      )}
      {!hasActiveShot && <NewShot documentId={documentId} blockId={blockId} />}
    </ul>
  );
}
