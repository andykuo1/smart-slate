import { useRef } from 'react';

import {
  useMediaStreamRecorder,
  useMediaStreamRecorderDevices,
} from './UseMediaStreamRecorder';

export function useRecorderContextValue() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const recorderControls = useMediaStreamRecorder(
    () => {},
    () => {},
  );
  const { isPrepared, mediaStreamRef } = recorderControls;
  const deviceIds = useMediaStreamRecorderDevices(mediaStreamRef, isPrepared);

  return {
    videoRef,
    ...recorderControls,
    ...deviceIds,
  };
}
