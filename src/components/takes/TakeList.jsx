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
    <fieldset className={'relative m-0 w-screen' + ' ' + className}>
      <legend className="absolute top-0 left-0 right-0 z-10 text-center -translate-y-[50%]">
        <button className="mx-auto px-2 bg-white rounded text-xl shadow-xl">
          Take List
        </button>
      </legend>
      <ul
        className={
          // TODO: This has the wrong box sizing (going to force it with screen at the moment)
          'bg-gray-100' + ' ' + getUnorderedListStyleByViewMode(viewMode)
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
    </fieldset>
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
