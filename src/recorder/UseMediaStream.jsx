import { useCallback, useRef } from 'react';

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @returns {[import('react').RefObject<MediaStream|null>, (constraints: MediaStreamConstraints|Array<MediaStreamConstraints>|undefined) => Promise<MediaStream>, () => Promise<void>]}
 */
export function useMediaStream(videoRef) {
  const ref = useRef(/** @type {MediaStream|null} */ (null));

  const dead = useCallback(
    async function dead() {
      // Remove stream from output video
      if (videoRef.current && videoRef.current.srcObject) {
        let video = videoRef.current;
        video.pause();
        video.srcObject = null;
      }

      if (ref.current) {
        let mediaStream = ref.current;
        for (let track of mediaStream.getTracks()) {
          track.enabled = false;
          track.stop();
        }
        ref.current = null;
      }
    },
    [ref, videoRef],
  );

  const init = useCallback(
    /**
     * @param {MediaStreamConstraints|Array<MediaStreamConstraints>} [constraints]
     */
    async function init(constraints = []) {
      if (ref.current) {
        await dead();
      }

      const mediaDevices = window.navigator.mediaDevices;
      if (!Array.isArray(constraints)) {
        constraints = [constraints];
      }
      if (constraints.length <= 0) {
        // @ts-expect-error no contraints were given, so let's just use the default.
        constraints.push(undefined);
      }
      let mediaStream = null;
      for (let constraint of constraints) {
        try {
          mediaStream = await mediaDevices
            .getUserMedia(constraint)
            .catch((e) => alert('failed!' + e.message));
          // Succeeded this constraint, skip the
          break;
        } catch {
          // Failed this contraint, try the next one.
          continue;
        }
      }
      if (!mediaStream) {
        throw new Error('Cannot initialize MediaStream with contraints.');
      }
      ref.current = mediaStream;

      // Add stream to output video
      if (videoRef.current && !videoRef.current.srcObject) {
        let video = videoRef.current;
        video.srcObject = mediaStream;
        await video.play();
      }
      return mediaStream;
    },
    [ref, videoRef, dead],
  );

  return [ref, init, dead];
}
