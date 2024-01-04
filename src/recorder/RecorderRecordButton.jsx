import { useContext } from 'react';

import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
} from '@/values/RecorderValues';

import { RecorderContext } from './RecorderContext';

export default function RecorderRecordButton() {
  const { isRecording, onStart, onStop } = useContext(RecorderContext);

  async function onClick() {
    if (isRecording) {
      await onStop({ exit: false, mediaBlobOptions: MEDIA_BLOB_OPTIONS });
    } else {
      await onStart({
        restart: false,
        record: true,
        mediaRecorderOptions: MEDIA_RECORDER_OPTIONS,
      });
    }
  }

  return (
    <button className="text-red-500 text-4xl" onClick={onClick}>
      ◉
    </button>
  );
}
