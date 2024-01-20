import { useCallback } from 'react';

import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';

import { formatExportName } from '@/serdes/ExportNameFormat';
import { getDocumentById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';
import { downloadText } from '@/utils/Downloader';

import SettingsFieldButton from './SettingsFieldButton';

export default function SettingsProjectExportJSONButton() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const documentId = useCurrentDocumentId();

  const handleClick = useCallback(
    function _handleClick() {
      const store = UNSAFE_getStore();
      const fileName = formatExportName(
        store,
        documentId,
        'EAGLESLATE',
        'PROJECT',
        'json',
      );
      const document = getDocumentById(store, documentId);
      downloadText(fileName, JSON.stringify(document));
    },
    [documentId, UNSAFE_getStore],
  );

  return (
    <SettingsFieldButton Icon={DownloadIcon} onClick={handleClick}>
      Export project file
    </SettingsFieldButton>
  );
}
