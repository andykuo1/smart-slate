import { useCallback, useState } from 'react';

import { useAnimationFrame } from '@/lib/animationframe';
import { useShotTakeCount } from '@/stores/DocumentStoreContext';
import { useCurrentCursor } from '@/stores/UserStoreContext';

import { useNextAvailableExportedFileName } from './ExportedFileName';
import RecorderPanel from './RecorderPanel';

export default function VideoBooth() {
  const cursor = useCurrentCursor();
  const takeCount = useShotTakeCount(cursor.documentId, cursor.shotId);
  const exportedFileName = useNextAvailableExportedFileName();

  const [status, setStatus] = useState(
    /** @type {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} */ (
      'idle'
    ),
  );

  const onChange = useCallback(
    /**
     * @param {object} e
     * @param {import('@/lib/mediarecorder/UseMediaRecorder').MediaRecorderStatus} e.status
     * @param {Blob|null} e.data
     */
    function onChange({ status, data }) {
      setStatus(status);
    },
    [setStatus],
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
        Status:{' '}
        {typeof status === 'string'
          ? status
          : `${status.name} - ${status.message}`}
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
