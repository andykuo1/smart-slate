import { useContext, useEffect } from 'react';

import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {MediaTrackConstraints} props.constraints
 */
export default function MediaStreamVideoConstraints({ constraints }) {
  const { mediaStream } = useContext(RecorderContext);

  useEffect(() => {
    if (!mediaStream) {
      return;
    }
    for (let track of mediaStream.getVideoTracks()) {
      track.applyConstraints(constraints);
    }
  }, [mediaStream, constraints]);

  useEffect(() => {
    if (!mediaStream) {
      return;
    }
    function onAddTrack() {
      console.error('There is a new track. Should we re-apply constraints?');
    }
    mediaStream.addEventListener('addtrack', onAddTrack);
    return () => {
      mediaStream.removeEventListener('addtrack', onAddTrack);
    };
  }, [mediaStream]);

  return null;
}
