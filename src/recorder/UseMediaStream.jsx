import { useCallback, useRef } from 'react';

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @returns {[import('react').RefObject<MediaStream|null>, (constraints: MediaStreamConstraints) => Promise<MediaStream>, () => Promise<void>]}
 */
export function useMediaStream(videoRef) {
  const ref = useRef(/** @type {MediaStream|null} */ (null));

  const init = useCallback(
    /**
     * @param {MediaStreamConstraints} constraints
     */
    async function init(constraints) {
      if (ref.current) {
        await dead();
      }

      let mediaStream =
        await window.navigator.mediaDevices.getUserMedia(constraints);
      ref.current = mediaStream;

      // Add stream to output video
      if (videoRef.current && !videoRef.current.srcObject) {
        let video = videoRef.current;
        video.srcObject = mediaStream;
        await video.play();
      }
      return mediaStream;
    },
    [ref, videoRef],
  );

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

  return [ref, init, dead];
}
