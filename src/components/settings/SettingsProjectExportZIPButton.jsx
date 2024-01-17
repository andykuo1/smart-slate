import { useCallback, useState } from 'react';

import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';
import { Zip, ZipPassThrough } from 'fflate';

import { getVideoBlob } from '@/recorder/cache';
import { formatExportName } from '@/serdes/ExportNameFormat';
import { getDocumentById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { getIDBKeyFromTakeId } from '@/stores/document/value';
import { useCurrentDocumentId } from '@/stores/user';
import { downloadURLImpl } from '@/utils/Downloader';

import SettingsFieldButton from './SettingsFieldButton';

export default function SettingsProjectExportZIPButton() {
  const [disabled, setDisabled] = useState(false);
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const documentId = useCurrentDocumentId();

  const handleClick = useCallback(
    function _handleClick() {
      const store = UNSAFE_getStore();
      const document = getDocumentById(store, documentId);
      const takes = Object.values(document?.takes || {});

      const zippedFileName = formatExportName(
        store,
        documentId,
        '',
        'EXPORTED_DATA',
        'zip',
      );

      (async () => {
        setDisabled(true);
        /** @type {Array<Uint8Array>} */
        let result = [];
        try {
          const zip = new Zip();
          zip.ondata = function onData(err, data, final) {
            if (err) {
              throw err;
            } else {
              result.push(data);
              if (final) {
                const blob = new Blob(result, { type: 'application/zip' });
                const blobURL = URL.createObjectURL(blob);
                downloadURLImpl(zippedFileName, blobURL);
                URL.revokeObjectURL(blobURL);
              }
            }
          };
          for (let take of takes) {
            const idbKey =
              take.exportedIDBKey || getIDBKeyFromTakeId(take.takeId);
            const fileName = take.exportedFileName;
            const blob = await getVideoBlob(documentId, idbKey);
            if (!blob) {
              continue;
            }
            addFileToZip(fileName, blob, zip);
          }
          zip.end();
        } finally {
          setDisabled(false);
        }
      })();
    },
    [documentId, UNSAFE_getStore, setDisabled],
  );

  return (
    <SettingsFieldButton
      Icon={DownloadIcon}
      onClick={handleClick}
      disabled={disabled}>
      Export all as .zip
    </SettingsFieldButton>
  );
}

/**
 * @param {string} fileName
 * @param {Blob} blob
 * @param {Zip} zip
 */
async function addFileToZip(fileName, blob, zip) {
  const zippedFileStream = new ZipPassThrough(fileName);
  zippedFileStream.mtime = new Date();
  zip.add(zippedFileStream);

  const fileReader = blob.stream().getReader();
  let result = true;
  while (result) {
    const { done, value } = await fileReader.read();
    if (done) {
      zippedFileStream.push(new Uint8Array(0), true);
      result = false;
      break;
    }
    zippedFileStream.push(value);
  }
}
