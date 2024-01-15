import { useCallback, useState } from 'react';

import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';
import { Zip, ZipPassThrough } from 'fflate';

import { getVideoBlob } from '@/recorder/cache';
import { getDocumentById, useDocumentStore } from '@/stores/document';
import { useCurrentDocumentId } from '@/stores/user';
import { downloadURLImpl } from '@/utils/Downloader';

import { formatProjectId } from '../takes/TakeNameFormat';
import SettingsFieldButton from './SettingsFieldButton';

export default function SettingsProjectDownloadButton() {
  const [disabled, setDisabled] = useState(false);
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const documentId = useCurrentDocumentId();

  const handleClick = useCallback(
    function _handleClick() {
      const store = UNSAFE_getStore();
      const document = getDocumentById(store, documentId);
      const takes = Object.values(document?.takes || {});

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
      const zippedFileName = `${projectId}_EXPORTED_DATA_${dateString}.zip`;

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
            const takeId = take.takeId;
            const fileName = take.exportedFileName;
            const blob = await getVideoBlob(documentId, takeId);
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
