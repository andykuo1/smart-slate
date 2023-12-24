import { MenuItem } from '@ariakit/react';
import { useEffect, useState } from 'react';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import { getTakeById } from '@/stores/DocumentDispatch';
import {
  useDocumentStore,
  useSetTakeExportedIDBKey,
  useTakeExportedIDBKey,
} from '@/stores/DocumentStoreContext';
import { deleteVideoBlob, getVideoBlob } from '@/stores/VideoCache';
import MenuStyle from '@/styles/Menu.module.css';
import { formatBytes } from '@/utils/StringFormat';

import { useForceRefreshOnMenuOpen } from './MenuItemHelper';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 */
export default function TakeCacheMenuItem({ documentId, takeId }) {
  // NOTE: It is important that cache checks are done sparingly (only when needed)
  const menuOpen = useForceRefreshOnMenuOpen();
  const [cached, setCached] = useState(false);
  const idbKey = useTakeExportedIDBKey(documentId, takeId);

  const size = useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.exportedSize || 0,
  );
  const setIDBKey = useSetTakeExportedIDBKey();

  async function onDeleteClick() {
    if (!idbKey || !cached) {
      return;
    }
    // TODO: This doesn't complete on mobile?
    await deleteVideoBlob(idbKey);
    setIDBKey(documentId, takeId, '');
  }

  useEffect(() => {
    getVideoBlob(takeId)
      .then((result) => {
        if (result) {
          setCached(true);
        } else {
          setCached(false);
        }
      })
      .catch(() => setCached(false));
  }, [menuOpen, takeId]);

  return (
    <div className="flex flex-row">
      <MenuItem
        className={MenuStyle.menuItem + ' ' + 'flex-1'}
        hideOnClick={false}
        disabled={!cached}>
        {cached ? (
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
        disabled={!cached}>
        <DeleteIcon className="w-6 h-6 fill-current" />
      </MenuItem>
    </div>
  );
}
