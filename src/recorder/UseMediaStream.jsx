import { useCallback, useRef, useState } from 'react';

import { tryGetMediaDevices, tryGetUserMedia } from '@/utils/BrowserFeatures';

export function useMediaStream() {
  const [mediaStream, setMediaStream] = useState(
    /** @type {MediaStream|null} */ (null),
  );
  const mediaStreamRef = useRef(/** @type {MediaStream|null} */ (null));

  const deadMediaStream = useCallback(
    async function _deadMediaStream() {
      if (!mediaStreamRef.current) {
        return;
      }
      let mediaStream = mediaStreamRef.current;
      for (let track of mediaStream.getTracks()) {
        track.enabled = false;
        track.stop();
      }
      mediaStreamRef.current = null;
      setMediaStream(null);
    },
    [mediaStreamRef],
  );

  const initMediaStream = useCallback(
    /**
     * @param {MediaStreamConstraints|Array<MediaStreamConstraints>} constraints
     * @param {boolean} restart
     */
    async function _initMediaStream(constraints = [], restart = true) {
      if (!Array.isArray(constraints)) {
        constraints = [constraints];
      }
      if (constraints.length <= 0) {
        // @ts-expect-error no contraints were given, so let's just use the default.
        constraints.push(undefined);
      }

      if (mediaStreamRef.current) {
        if (restart) {
          await deadMediaStream();
        } else {
          return mediaStreamRef.current;
        }
      }

      const mediaDevices = await tryGetMediaDevices();
      const mediaStream = await tryGetUserMedia(mediaDevices, constraints);
      mediaStreamRef.current = mediaStream;
      setMediaStream(mediaStream);

      return mediaStream;
    },
    [mediaStreamRef, deadMediaStream],
  );

  return { mediaStream, mediaStreamRef, initMediaStream, deadMediaStream };
}
