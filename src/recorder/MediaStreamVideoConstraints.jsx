import { useCallback, useContext, useEffect } from 'react';

import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {MediaTrackConstraints} props.constraints
 */
export default function MediaStreamVideoConstraints({ constraints }) {
  const { mediaStream } = useContext(RecorderContext);

  const updateConstraints = useCallback(
    function _updateConstraints() {
      if (!mediaStream) {
        return;
      }
      let orientedConstraints = getLandscapeOrientedConstraints(constraints);
      for (let track of mediaStream.getVideoTracks()) {
        track.applyConstraints(orientedConstraints);
      }
    },
    [mediaStream, constraints],
  );

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
    // Apply it on load first!
    updateConstraints();

    // ... and also every orientation change.
    /** @param {Event} e */
    function onOrientationChange(e) {
      if (!mediaStream) {
        return;
      }
      const target = /** @type {ScreenOrientation} */ (e.target);
      console.log(
        '[MediaStreamVideoConstraints] Orientation changed to ' +
          target.type +
          '. Changing constraints to match.',
      );
      console.log(
        '[MediaStreamVideoConstraints] ' +
          JSON.stringify(mediaStream.getVideoTracks()[0].getCapabilities()),
      );
      updateConstraints();
    }

    screen?.orientation?.addEventListener('change', onOrientationChange);
    return () =>
      screen?.orientation?.removeEventListener('change', onOrientationChange);
  }, [mediaStream, constraints, updateConstraints]);

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
