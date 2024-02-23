import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import AnimatedEllipsis from '@/libs/AnimatedEllipsis';
import HorizontallyScrollableDiv from '@/libs/HorizontallyScrollableDiv';
import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import { useGoogleDriveSync } from '@/libs/googleapi/sync/GoogleDriveSync';
import { getDocumentById, getDocumentSettingsById } from '@/stores/document';
import { useActiveDocumentIds, useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId, useSetUserCursor } from '@/stores/user';

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
  const currentDocumentId = useCurrentDocumentId();
  const setUserCursor = useSetUserCursor();
  const navigate = useNavigate();
  const syncStatus = useProjectSyncStatus(documentId);
  const isProjectIncluded = isProjectIncludedBySyncStatus(syncStatus);
  const isProjectLoading = currentDocumentId === documentId;
  const isAnyProjectLoading = Boolean(currentDocumentId);

  const onClick = useCallback(
    function _onClick() {
      if (currentDocumentId) {
        navigate('/edit');
        return;
      }

      setUserCursor(documentId, '', '', '');

      if ((autoSaveTo === '' || autoSaveTo === 'local') && googleStatus) {
        // Force upload this project if connected but not sync...
        setDocumentSettingsAutoSaveTo(documentId, 'gdrive');
      }

      if (autoSaveTo === 'gdrive') {
        // Import from GoogleDrive before opening...
        syncToGoogleDrive().then(() => {
          // ...then go there.
          navigate('/edit');
        });
      } else {
        // Or just go there now.
        navigate('/edit');
      }
    },
    [
      currentDocumentId,
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
        (!isProjectIncluded ? 'opacity-50 hover:opacity-100' : '') +
        ' ' +
        (isAnyProjectLoading ? 'pointer-events-none opacity-50' : '') +
        ' ' +
        className
      }
      title={`Open "${titleWithPlaceholder}" Project`}
      onClick={onClick}>
      <div className="flex h-full flex-col">
        <h3
          className={
            'text-gray-300 group-hover:font-bold group-hover:text-gray-600' +
            ' ' +
            (isProjectLoading ? 'font-bold text-gray-600' : '')
          }>
          {isProjectLoading ? (
            <AnimatedEllipsis>Loading</AnimatedEllipsis>
          ) : (
            getProjectOpenActionTextBySyncStatus(syncStatus)
          )}
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

/** @typedef {ReturnType<useProjectSyncStatus>} ProjectSyncStatus */

/**
 * @param {ProjectSyncStatus} syncStatus
 */
function isProjectIncludedBySyncStatus(syncStatus) {
  return (
    syncStatus !== 'upload' &&
    syncStatus !== 'offline' &&
    syncStatus !== 'deleted' &&
    syncStatus !== 'error' &&
    syncStatus !== 'unknown'
  );
}

/**
 * @param {ProjectSyncStatus} syncStatus
 */
function getProjectOpenActionTextBySyncStatus(syncStatus) {
  switch (syncStatus) {
    case 'upload':
      return 'Upload';
    default:
      return 'Open';
  }
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 */
function useProjectSyncStatus(documentId) {
  const autoSaveTo = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.autoSaveTo,
  );
  const lastDeletedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastDeletedMillis,
  );
  const lastUpdatedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastUpdatedMillis,
  );
  const lastExportedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastExportedMillis,
  );
  const lastDataExportedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastDataExportedMillis,
  );
  const hasLocalChanges = lastUpdatedMillis > lastExportedMillis;
  const googleStatus = useGoogleStatus();
  if (lastDeletedMillis > 0) {
    return 'deleted';
  }
  switch (autoSaveTo) {
    case '':
    case 'local':
      if (lastExportedMillis > 0) {
        // This was once exported, but sync has been turned off.
        return 'localonly';
      } else if (googleStatus) {
        // Connected! And will sync if opened.
        return 'upload';
      }
      return 'open';
    case 'gdrive':
      if (!googleStatus) {
        // Not connected!
        return 'offline';
      }
      if (lastDataExportedMillis < lastExportedMillis) {
        // Data wasn't downloaded-- just metadata.
        // ...and it won't until the user opens it.
        return 'partial';
      }
      if (!hasLocalChanges) {
        // No local changes. Should be synced :)
        return 'online';
      } else {
        // There needs to be a sync soon!
        return 'pending';
      }
    default:
      // For any other kind of auto-save (since they are unknown at the moment).
      if (hasLocalChanges) {
        return 'error';
      } else {
        return 'unknown';
      }
  }
}
