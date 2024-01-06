import { MenuItem } from '@ariakit/react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ShareIcon from '@material-symbols/svg-400/rounded/share.svg';

import { tryGetSharing } from '@/recorder/UseMediaStream';
import { getVideoBlob } from '@/recorder/cache';
import { useDocumentStore } from '@/stores/document';
import { useCurrentDocumentId, useSetUserCursor } from '@/stores/user';
import MenuStyle from '@/styles/Menu.module.css';
import { APP_TITLE } from '@/values/PackageJSON';
import { MEDIA_BLOB_OPTIONS } from '@/values/RecorderValues';

export default function ShareFilesMenuItem() {
  const documentId = useCurrentDocumentId();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setUserCursor = useSetUserCursor();
  const deleteDocument = useDocumentStore((ctx) => ctx.deleteDocument);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);

  const handleClick = useCallback(
    function _handleClick() {
      const store = UNSAFE_getStore();
      const takes = Object.entries(store.documents[documentId].takes);
      let promises = [];
      for (let [takeId, take] of takes) {
        const fileName = take.exportedFileName;
        promises.push(
          getVideoBlob(takeId).then(
            (blob) =>
              new File(blob, fileName, { type: MEDIA_BLOB_OPTIONS.type }),
          ),
        );
        break;
      }
      Promise.all(promises).then(async (files) => {
        try {
          const sharing = tryGetSharing();
          const sharable = { title: APP_TITLE, files };
          if (sharing.canShare(sharable)) {
            return sharing.share(sharable);
          } else {
            // TODO: Cannot share these?
            window.alert('Unable to share files.');
          }
        } catch {
          // Sharing wasn't allowed. In the future...
          // TODO: Just download a zip of everything.
        }
      });
    },
    [documentId, setUserCursor, deleteDocument, navigate],
  );

  useEffect(() => {
    try {
      tryGetSharing();
      if (disabled) {
        setDisabled(false);
      }
    } catch {
      if (!disabled) {
        setDisabled(true);
      }
    }
  }, [disabled, setDisabled]);

  return (
    <MenuItem
      className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
      onClick={handleClick}
      disabled={true}>
      <ShareIcon className="h-full fill-current" />
      Share Files
    </MenuItem>
  );
}
