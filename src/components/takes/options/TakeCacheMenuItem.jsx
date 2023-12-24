import { MenuItem } from '@ariakit/react';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import { useCachedVideoBlob } from '@/recorder/cache/UseCachedVideoBlob';
import { deleteVideoBlob } from '@/recorder/cache/VideoCache';
import { getTakeById } from '@/stores/DocumentDispatch';
import {
  useDocumentStore,
  useSetTakeExportedIDBKey,
  useTakeExportedIDBKey,
} from '@/stores/DocumentStoreContext';
import MenuStyle from '@/styles/Menu.module.css';
import { formatBytes } from '@/utils/StringFormat';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 */
export default function TakeCacheMenuItem({ documentId, takeId }) {
  const videoBlob = useCachedVideoBlob(documentId, takeId);
  const idbKey = useTakeExportedIDBKey(documentId, takeId);

  const size = useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.exportedSize || 0,
  );
  const setIDBKey = useSetTakeExportedIDBKey();

  async function onDeleteClick() {
    if (!idbKey || !videoBlob) {
      return;
    }
    // TODO: This doesn't complete on mobile?
    await deleteVideoBlob(idbKey);
    setIDBKey(documentId, takeId, '');
  }

  return (
    <div className="flex flex-row">
      <MenuItem
        className={MenuStyle.menuItem + ' ' + 'flex-1'}
        hideOnClick={false}
        disabled={!videoBlob}>
        {videoBlob ? (
          <>
            <span>Cache</span>
            <output className="font-mono text-sm">
              {formatBytes(size, 2)}
            </output>
          </>
        ) : (
          <span>Not Cached</span>
        )}
      </MenuItem>
      <MenuItem
        className={MenuStyle.menuItem}
        hideOnClick={false}
        onClick={onDeleteClick}
        disabled={!videoBlob}>
        <DeleteIcon className="w-6 h-6 fill-current" />
      </MenuItem>
    </div>
  );
}
