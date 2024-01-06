import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
} from '@/values/RecorderValues';

import MediaRecorderStartStop from './MediaRecorderStartStop';

/**
 * @param {object} props
 * @param {(blob: Blob) => void} props.onComplete
 */
export default function RecorderRecordButton({ onComplete }) {
  return (
    <MediaRecorderStartStop
      className="text-red-500 text-4xl"
      mediaRecorderOptions={MEDIA_RECORDER_OPTIONS}
      blobOptions={MEDIA_BLOB_OPTIONS}
      onStop={(recorder, blob) => {
        if (blob) {
          onComplete(blob);
        }
      }}>
      ◉
    </MediaRecorderStartStop>
  );
}
