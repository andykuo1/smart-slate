import { Fragment, useEffect, useState } from 'react';

import { useGAPITokenHandler } from '@/lib/googleapi';
import { useTakeIds } from '@/stores/DocumentStoreContext';

import { NewTake, TakeEntry } from './TakeEntry';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {'list'|'inline'} props.viewMode
 */
export default function TakeList({ documentId, sceneId, shotId, viewMode }) {
  const takeIds = useTakeIds(documentId, shotId);
  const [cloudExportable, setCloudExportable] = useState(false);
  const handleToken = useGAPITokenHandler();

  useEffect(() => {
    if (!handleToken((token) => setCloudExportable(Boolean(token)))) {
      setCloudExportable(false);
    }
  }, [handleToken, setCloudExportable]);

  return (
    <ul
      title="Take list"
      className={
        'bg-gray-100' + ' ' + getUnorderedListStyleByViewMode(viewMode)
      }>
      <NewTake documentId={documentId} shotId={shotId} viewMode={viewMode} />
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
              viewMode={viewMode}
            />
          </Fragment>
        ))}
    </ul>
  );
}

/**
 * @param {string} viewMode
 */
function getUnorderedListStyleByViewMode(viewMode) {
  switch (viewMode) {
    case 'list':
      return 'flex flex-col';
    case 'inline':
      return 'flex flex-row overflow-x-auto';
    default:
      throw new Error('Unknown view mode - ' + viewMode);
  }
}
