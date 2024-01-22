import { Fragment } from 'react';

import { useTakeIds } from '@/stores/document';

import TakeEntry from './TakeEntry';
import TakeEntryNew from './TakeEntryNew';

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

  return (
    <ul
      className={
        // TODO: This has the wrong box sizing (going to force it with screen at the moment)
        'bg-gray-100 w-screen' +
        ' ' +
        getUnorderedListStyleByViewMode(viewMode) +
        ' ' +
        className
      }>
      <TakeEntryNew
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
        shotId={shotId}
        viewMode={viewMode}
      />
      {takeIds
        .slice()
        .reverse()
        .map((takeId) => (
          <Fragment key={`take-${takeId}`}>
            <TakeEntry
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              shotId={shotId}
              takeId={takeId}
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
