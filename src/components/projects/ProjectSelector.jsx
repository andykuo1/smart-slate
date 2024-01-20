import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import HorizontallyScrollableDiv from '@/libs/HorizontallyScrollableDiv';
import { getDocumentById } from '@/stores/document';
import { useDocumentIds, useDocumentStore } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';

import ProjectListStatusButton from './ProjectListStatusButton';
import ProjectSyncStatus from './ProjectSyncStatus';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function ProjectSelector({ className }) {
  const documentIds = useDocumentIds();

  if (documentIds.length <= 0) {
    return (
      <label className={'mx-auto my-2 text-gray-400' + ' ' + className}>
        Pick one to get started!
      </label>
    );
  }
  return (
    <>
      <label className="flex flex-row items-center mx-auto my-2 text-gray-400">
        Or open an existing project...
      </label>
      <div className="relative mx-auto w-[60%] max-w-[60%] text-xs text-white">
        <div className="h-1" />
        <ProjectListStatusButton className="absolute -right-2 -bottom-5 z-10 rounded-xl mx-2 p-2 bg-black" />
      </div>
      <HorizontallyScrollableDiv
        className={
          'w-[60%] max-w-[60%] rounded-xl bg-black border-x-8 border-y-4 border-black' +
          ' ' +
          className
        }>
        <ul className="flex flex-row">
          <div className="flex-1 min-w-[2rem] text-white text-right my-auto">
            |
          </div>
          {documentIds.map((documentId) => (
            <ProjectSelectorOption key={documentId} documentId={documentId} />
          ))}
          <div className="flex-1 min-w-[2rem] text-white text-left my-auto">
            |
          </div>
        </ul>
      </HorizontallyScrollableDiv>
    </>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function ProjectSelectorOption({ documentId }) {
  const title = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.documentTitle,
  );
  const lastDeletedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastDeletedMillis,
  );
  const lastUpdatedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastUpdatedMillis,
  );
  const setUserCursor = useSetUserCursor();
  const navigate = useNavigate();

  const onClick = useCallback(
    function onClick() {
      // NOTE: Sync from GoogleDrive first.
      setUserCursor(documentId, '', '', '');
      navigate('/edit');
    },
    [documentId, setUserCursor, navigate],
  );

  const titleWithPlaceholder = title || 'Untitled';

  if (lastDeletedMillis > 0) {
    // It's been deleted, so don't show it.
    return null;
  }
  return (
    <li
      className={
        'relative overflow-hidden text-center w-[8rem] min-w-[8rem] max-w-[8rem]' +
        ' ' +
        'bg-gray-100 rounded-xl mx-2 my-4 p-2' +
        ' ' +
        'hover:bg-white hover:cursor-pointer'
      }
      title={`Open "${titleWithPlaceholder}" Project`}
      onClick={onClick}>
      <div className="flex flex-col">
        <h3 className="text-gray-300">Open</h3>
        <p className={lastDeletedMillis > 0 ? 'line-through' : ''}>
          {titleWithPlaceholder}
        </p>
        <p className="text-gray-400">
          {new Date(lastUpdatedMillis).toLocaleString()}
        </p>
      </div>
      <ProjectSyncStatus
        className="absolute top-1 right-1 text-gray-600"
        documentId={documentId}
      />
    </li>
  );
}
