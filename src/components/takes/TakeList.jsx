import { Fragment, useEffect, useState } from 'react';

import { useGAPITokenHandler } from '@/libs/googleapi';
import { useTakeIds } from '@/stores/document';

import { NewTake, TakeEntry } from './TakeEntry';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {'list'|'inline'} props.viewMode
 */
export default function TakeList({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
  viewMode,
}) {
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
        // TODO: This has the wrong box sizing (going to force it with screen at the moment)
        'bg-gray-100 w-screen' + ' ' + getUnorderedListStyleByViewMode(viewMode)
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
