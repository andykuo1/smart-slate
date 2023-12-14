import { useCallback, useState } from 'react';

import { useAnimationFrame } from '@/lib/animationframe';
import { useGAPITokenHandler } from '@/lib/googleapi';
import { uploadFile } from '@/lib/googleapi/UploadFile';
import { createTake } from '@/stores/DocumentStore';
import { useAddTake, useShotTakeCount } from '@/stores/DocumentStoreContext';
import { useCurrentCursor, useSetUserCursor } from '@/stores/UserStoreContext';
import { downloadURLImpl } from '@/utils/Downloader';

import { useNextAvailableExportedFileName } from './ExportedFileName';
import RecorderPanel from './RecorderPanel';
import { getVideoFileExtensionByMIMEType } from './UseMediaRecorder';

export default function VideoBooth() {
  const cursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const addTake = useAddTake();
  const takeCount = useShotTakeCount(cursor.documentId, cursor.shotId);
  const exportedFileName = useNextAvailableExportedFileName();
  const tokenHandler = useGAPITokenHandler();

  const [status, setStatus] = useState(
    /** @type {import('./UseMediaRecorder').MediaRecorderStatus} */ ('idle'),
  );

  const onChange = useCallback(
    /**
     * @param {object} e
     * @param {import('./UseMediaRecorder').MediaRecorderStatus} e.status
     * @param {Blob|null} e.data
     */
    function onChange({ status, data }) {
      setStatus(status);
      if (!data) {
        return;
      }
      let newTake = createTake();
      newTake.exportedFileName = exportedFileName;
      newTake.exportedMillis = Date.now();
      addTake(cursor.documentId, cursor.shotId, newTake);
      setUserCursor(
        cursor.documentId,
        cursor.sceneId,
        cursor.shotId,
        newTake.takeId,
      );
      const ext = getVideoFileExtensionByMIMEType(data.type);
      const exportedFileNameWithExt = `${exportedFileName}${ext}`;
      if (
        !tokenHandler((token) => {
          uploadFile(
            token.access_token,
            exportedFileNameWithExt,
            data.type,
            data,
          )
            .then(() => {
              console.log('Upload file - ' + exportedFileNameWithExt);
            })
            .catch(() => {
              console.error(
                'Failed to upload file - ' + exportedFileNameWithExt,
              );
            });
        })
      ) {
        const dataURL = URL.createObjectURL(data);
        downloadURLImpl(exportedFileName, dataURL);
      }
    },
    [addTake, cursor, exportedFileName, setUserCursor, tokenHandler],
  );

  return (
    <>
      <h2 className="absolute text-white top-5 left-0 right-0 text-center text-xl z-10 pointer-events-none mx-40">
        <span className="inline-block">{exportedFileName}</span>
        <span className="mx-4" />
        <DateTime />
        <span className="mx-4" />
        <span className="inline-block">
          Take #{takeCount + 1}
          <RecordingSignal active={status === 'recording'} />
        </span>
      </h2>
      <RecorderPanel onChange={onChange} />
      <p className="absolute bottom-8 left-0 right-0 text-white text-center pointer-events-none">
        Status: {JSON.stringify(status)}
      </p>
    </>
  );
}

/**
 * @param {object} props
 * @param {boolean} props.active
 */
function RecordingSignal({ active }) {
  return (
    <div
      className={
        'inline-block mx-2 w-[1rem] h-[1rem] rounded-full border-2' +
        ' ' +
        (active ? 'bg-red-500 border-red-500' : 'bg-black border-white')
      }
    />
  );
}

function DateTime() {
  const [dateTime, setDateTime] = useState('');
  const onAnimationFrame = useCallback(
    function onAnimationFrame() {
      setDateTime(new Date().toLocaleString());
    },
    [setDateTime],
  );
  useAnimationFrame(onAnimationFrame);

  return <span className="inline-block">{dateTime}</span>;
}
