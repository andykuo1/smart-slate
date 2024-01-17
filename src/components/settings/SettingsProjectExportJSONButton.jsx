import { useCallback, useState } from 'react';

import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';

import { getDocumentById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';
import { downloadText } from '@/utils/Downloader';

import { formatProjectId } from '../takes/TakeNameFormat';
import SettingsFieldButton from './SettingsFieldButton';

export default function SettingsProjectExportJSONButton() {
  const [disabled, setDisabled] = useState(false);
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const documentId = useCurrentDocumentId();

  const handleClick = useCallback(
    function _handleClick() {
      const store = UNSAFE_getStore();
      const document = getDocumentById(store, documentId);
      const projectId = formatProjectId(
        document?.settings?.projectId || document?.documentTitle,
      );
      const date = new Date();
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate() + 1).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');
      const dateString = `${year}_${month}_${day}_${hour}_${minute}_${second}`;
      const fileName = `EAGLESLATE_${projectId}_PROJECT_${dateString}.json`;
      downloadText(fileName, JSON.stringify(document));
    },
    [documentId, UNSAFE_getStore, setDisabled],
  );

  return (
    <SettingsFieldButton
      Icon={DownloadIcon}
      onClick={handleClick}
      disabled={disabled}>
      Export project file
    </SettingsFieldButton>
  );
}
