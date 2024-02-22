import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import HorizontallyScrollableDiv from '@/libs/HorizontallyScrollableDiv';
import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import { useGoogleDriveSync } from '@/libs/googleapi/sync/GoogleDriveSync';
import { getDocumentById, getDocumentSettingsById } from '@/stores/document';
import { useActiveDocumentIds, useDocumentStore } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';

import ProjectListStatusButton from './ProjectListStatusButton';
import ProjectOpenStatus from './ProjectOpenStatus';
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
    <div className={'relative flex flex-col items-center' + ' ' + className}>
      <div className="mb-2 flex w-full max-w-[80vw] items-end">
        <label className="mx-2 flex-1 truncate text-center opacity-30">
          Or open project
        </label>
      </div>
      <ProjectListStatusButton className="absolute bottom-0 right-0 z-10 -mt-2 translate-y-5 rounded-xl bg-black p-2 text-white" />
      <HorizontallyScrollableDiv
        className={
          'w-full max-w-[80vw] rounded-xl border-x-8 border-y-4 border-black bg-black'
        }>
        <ul className="flex flex-row">
          <div className="my-auto min-w-[2rem] flex-1 text-right text-white">
            |
          </div>
          {documentIds.map((documentId) => (
            <ProjectSelectorOption key={documentId} documentId={documentId} />
          ))}
          <div className="my-auto min-w-[2rem] flex-1 text-left text-white">
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
  const setDocumentSettingsAutoSaveTo = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsAutoSaveTo,
  );
  const { syncToGoogleDrive } = useGoogleDriveSync();
  const googleStatus = useGoogleStatus();
  const setUserCursor = useSetUserCursor();
  const navigate = useNavigate();

  const onClick = useCallback(
    async function _onClick() {
      if ((autoSaveTo === '' || autoSaveTo === 'local') && googleStatus) {
        // Force upload this project if connected but not sync...
        setDocumentSettingsAutoSaveTo(documentId, 'gdrive');
      }
      if (autoSaveTo === 'gdrive') {
        // Import from GoogleDrive before opening...
        await syncToGoogleDrive();
      }
      setUserCursor(documentId, '', '', '');
      navigate('/edit');
    },
    [
      googleStatus,
      autoSaveTo,
      documentId,
      setUserCursor,
      navigate,
      syncToGoogleDrive,
      setDocumentSettingsAutoSaveTo,
    ],
  );

  const titleWithPlaceholder = title || 'Untitled';

  if (lastDeletedMillis > 0) {
    // It's been deleted, so don't show it.
    return null;
  }
  return (
    <li
      className={
        'group relative max-h-[30vmin] w-[8rem] min-w-[8rem] max-w-[8rem] overflow-hidden text-center' +
        ' ' +
        'mx-2 my-4 rounded-xl bg-gray-100 p-2 dark:bg-gray-800' +
        ' ' +
        'hover:cursor-pointer hover:bg-white dark:hover:bg-gray-600' +
        ' ' +
        className
      }
      title={`Open "${titleWithPlaceholder}" Project`}
      onClick={onClick}>
      <div className="flex h-full flex-col">
        <h3 className="text-gray-300 group-hover:font-bold group-hover:text-gray-600">
          <ProjectOpenStatus documentId={documentId} />
        </h3>
        <ProjectSyncStatus
          className="absolute right-1 top-1 text-gray-600"
          documentId={documentId}
        />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <p className={lastDeletedMillis > 0 ? 'line-through' : ''}>
            {titleWithPlaceholder}
          </p>
          <p className="text-gray-400">
            {new Date(lastUpdatedMillis).toLocaleString()}
          </p>
        </div>
      </div>
    </li>
  );
}
