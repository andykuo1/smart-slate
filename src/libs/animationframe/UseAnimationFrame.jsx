import { useEffect, useRef } from 'react';

/**
 * Performs callback for each animation frame after component is mounted.
 *
 * @param {FrameRequestCallback} callback
 */
export function useAnimationFrame(callback) {
  const animationFrameHandle = useRef(0);
  /** @param {number} now */
  function wrapper(now) {
    if (animationFrameHandle.current === 0) {
      return;
    }
    callback(now);
    animationFrameHandle.current = requestAnimationFrame(wrapper);
  }
  useEffect(() => {
    animationFrameHandle.current = requestAnimationFrame(wrapper);
    return () => {
      cancelAnimationFrame(animationFrameHandle.current);
      animationFrameHandle.current = 0;
    };
  });
}
