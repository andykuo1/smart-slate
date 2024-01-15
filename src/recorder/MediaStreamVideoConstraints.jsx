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
      const tracks = mediaStream.getVideoTracks();
      const orientedConstraints = getLandscapeOrientedConstraints(constraints);
      const filteredConstraints = filterSupportedConstraints(
        tracks[0].getCapabilities(),
        orientedConstraints,
      );
      console.log(
        '[MediaStreamVideoConstraints] Applying video constraints - ' +
          JSON.stringify(orientedConstraints) +
          ' -> ' +
          JSON.stringify(filteredConstraints),
      );
      for (let track of mediaStream.getVideoTracks()) {
        track.applyConstraints(filteredConstraints);
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
      aspectRatio: 9 / 16,
    };
  }
  return constraints;
}

/**
 *
 * @param {MediaTrackCapabilities} capabilities
 * @param {MediaTrackConstraints} constraints
 */
function filterSupportedConstraints(capabilities, constraints) {
  /** @type {Record<string, any>} */
  let result = {};
  for (let key of Object.keys(constraints)) {
    if (key in capabilities) {
      // @ts-expect-error This is already a key of the constraints.
      result[key] = constraints[key];
    }
  }
  return result;
}
