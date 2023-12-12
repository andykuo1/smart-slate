import { useCallback, useState } from 'react';

import { useAnimationFrame } from '@/hooks/animationframe';
import { createTake, toScenShotTakeType } from '@/stores/DocumentStore';
import {
  useAddTake,
  useDocumentTitle,
  useSceneNumber,
  useShotNumber,
  useShotTakeCount,
  useShotType,
  useTakeNumber,
} from '@/stores/DocumentStoreContext';
import { ANY_SHOT } from '@/stores/ShotTypes';
import {
  useCurrentCursor,
  useCurrentRecorder,
  useSetUserCursor,
} from '@/stores/UserStoreContext';
import { downloadURLImpl } from '@/utils/Downloader';

import RecorderPanel from './RecorderPanel';

export default function VideoBooth() {
  const cursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const addTake = useAddTake();
  const takeCount = useShotTakeCount(cursor.documentId, cursor.shotId);
  const exportedFileName = useNextAvailableExportedFileName();

  const [status, setStatus] = useState(
    /** @type {import('./UseMediaRecorder').MediaRecorderStatus} */ ('idle'),
  );

  const onChange = useCallback(
    /**
     * @param {object} e
     * @param {import('./UseMediaRecorder').MediaRecorderStatus} e.status
     * @param {string} e.data
     */
    function onChange({ status, data }) {
      setStatus(status);
      if (!data) {
        return;
      }
      let newTake = createTake();
      addTake(cursor.documentId, cursor.shotId, newTake);
      setUserCursor(
        cursor.documentId,
        cursor.sceneId,
        cursor.shotId,
        newTake.takeId,
      );
      downloadURLImpl(exportedFileName, data);
    },
    [addTake, cursor, exportedFileName, setUserCursor],
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

export function useNextAvailableExportedFileName() {
  const { documentId, sceneId, shotId } = useCurrentCursor();
  const documentTitle = useDocumentTitle(documentId) || 'Untitled';
  // TODO: What if documentTitle changes? Should we use this hash?
  /*
  const documentName =
    documentTitle.charAt(0).toUpperCase() + documentId.substring(0, 4);
  */
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const takeNumber = useShotTakeCount(documentId, shotId) + 1;
  const shotType = useShotType(documentId, shotId);
  const [scen, shot, take, type] = toScenShotTakeType(
    sceneNumber,
    shotNumber,
    takeNumber,
    shotType,
  );
  return (
    `${documentTitle}_${scen}${shot}${take}` +
    (shotType !== ANY_SHOT.value ? `_${type}` : '')
  );
}
