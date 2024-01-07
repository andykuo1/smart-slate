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
    let orientedConstraints = getLandscapeOrientedConstraints(constraints);
    for (let track of mediaStream.getVideoTracks()) {
      track.applyConstraints(orientedConstraints);
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

  useEffect(() => {
    /** @param {Event} e */
    function onOrientationChange(e) {
      if (!mediaStream) {
        return;
      }
      const target = /** @type {ScreenOrientation} */ (e.target);
      console.error(
        'Orientation changed to ' +
          target.type +
          '. Changing constraints to match.',
      );
      let orientedConstraints = getLandscapeOrientedConstraints(constraints);
      for (let track of mediaStream.getVideoTracks()) {
        track.applyConstraints(orientedConstraints);
      }
    }
    screen?.orientation?.addEventListener('change', onOrientationChange);
    return () =>
      screen?.orientation?.removeEventListener('change', onOrientationChange);
  }, [mediaStream, constraints]);

  return null;
}

/**
 * @param {MediaTrackConstraints} constraints
 */
function getLandscapeOrientedConstraints(constraints) {
  if (screen.orientation.type.includes('portrait')) {
    return {
      ...constraints,
      width: constraints.height,
      height: constraints.width,
      aspectRatio: undefined,
    };
  }
  return constraints;
}
