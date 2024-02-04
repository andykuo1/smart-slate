import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import HorizontallyScrollableDiv from '@/libs/HorizontallyScrollableDiv';
import { useGoogleDriveSync } from '@/libs/googleapi/sync/GoogleDriveSync';
import { getDocumentById, getDocumentSettingsById } from '@/stores/document';
import { useActiveDocumentIds, useDocumentStore } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';

import ProjectListStatusButton from './ProjectListStatusButton';
import ProjectSyncStatus from './ProjectSyncStatus';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function ProjectSelector({ className }) {
  const documentIds = useActiveDocumentIds();

  if (documentIds.length <= 0) {
    return (
      <div className={'flex flex-col items-center' + ' ' + className}>
        <label className="my-2 opacity-50">Pick one to get started!</label>
      </div>
    );
  }
  return (
    <div className={'flex flex-col items-center' + ' ' + className}>
      <div className="relative flex items-end w-full max-w-[80vw] mb-2">
        <label className="flex-1 mx-2 opacity-30 text-center truncate">
          Or open project
        </label>
        <ProjectListStatusButton className="absolute right-0 top-0 translate-y-5 z-10 rounded-xl p-2 -mt-2 bg-black text-white" />
      </div>
      <HorizontallyScrollableDiv
        className={
          'w-full max-w-[80vw] rounded-xl bg-black border-x-8 border-y-4 border-black'
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
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function ProjectSelectorOption({ className, documentId }) {
  const title = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.documentTitle,
  );
  const lastDeletedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastDeletedMillis,
  );
  const lastUpdatedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastUpdatedMillis,
  );
  const autoSaveTo = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.autoSaveTo,
  );
  const { syncToGoogleDrive } = useGoogleDriveSync();
  const setUserCursor = useSetUserCursor();
  const navigate = useNavigate();

  const onClick = useCallback(
    async function onClick() {
      if (autoSaveTo === 'gdrive') {
        // Import from GoogleDrive before opening...
        await syncToGoogleDrive();
      }
      setUserCursor(documentId, '', '', '');
      navigate('/edit');
    },
    [autoSaveTo, documentId, setUserCursor, navigate, syncToGoogleDrive],
  );

  const titleWithPlaceholder = title || 'Untitled';

  if (lastDeletedMillis > 0) {
    // It's been deleted, so don't show it.
    return null;
  }
  return (
    <li
      className={
        'relative overflow-hidden text-center w-[8rem] min-w-[8rem] max-w-[8rem] max-h-[30vmin]' +
        ' ' +
        'bg-gray-100 rounded-xl mx-2 my-4 p-2' +
        ' ' +
        'hover:bg-white hover:cursor-pointer' +
        ' ' +
        className
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
