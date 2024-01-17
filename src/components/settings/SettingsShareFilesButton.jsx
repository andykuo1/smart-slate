import { useCallback, useEffect, useState } from 'react';

import ShareIcon from '@material-symbols/svg-400/rounded/share.svg';

import { getVideoBlob } from '@/recorder/cache';
import { useDocumentStore } from '@/stores/document/use';
import { getIDBKeyFromTakeId } from '@/stores/document/value';
import { useCurrentDocumentId } from '@/stores/user';
import { tryGetSharing } from '@/utils/BrowserFeatures';
import { APP_TITLE } from '@/values/PackageJSON';
import { MEDIA_BLOB_OPTIONS } from '@/values/RecorderValues';

import SettingsFieldButton from './SettingsFieldButton';

export default function SettingsShareFilesButton() {
  const documentId = useCurrentDocumentId();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const [disabled, setDisabled] = useState(true);

  const handleClick = useCallback(
    function _handleClick() {
      const store = UNSAFE_getStore();
      const takes = Object.entries(store.documents[documentId].takes);
      let promises = [];
      for (let [takeId, take] of takes) {
        const idbKey = take.exportedIDBKey || getIDBKeyFromTakeId(takeId);
        const fileName = take.exportedFileName;
        promises.push(
          getVideoBlob(documentId, idbKey).then((blob) =>
            blob
              ? new File([blob], fileName, { type: MEDIA_BLOB_OPTIONS.type })
              : null,
          ),
        );
        break;
      }
      Promise.all(promises).then(async (files) => {
        try {
          const sharing = tryGetSharing();
          /** @type {ShareData} */
          const sharable = {
            title: APP_TITLE,
            files: /** @type {File[]} */ (
              files.filter((file) => file !== null)
            ),
          };
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
    [documentId, UNSAFE_getStore],
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
    <SettingsFieldButton Icon={ShareIcon} onClick={handleClick} disabled={true}>
      Share files
    </SettingsFieldButton>
  );
}
