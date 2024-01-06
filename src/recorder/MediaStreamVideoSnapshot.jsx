import { useCallback, useEffect, useState } from 'react';

import { drawElementToCanvasWithRespectToAspectRatio } from './snapshot/VideoSnapshot';

/**
 * @param {object} props
 * @param {import('react').RefObject<HTMLVideoElement>} props.videoRef
 * @param {(event: { value: string, target: HTMLVideoElement }) => void} props.onSnapshot
 * @param {number} props.snapshotWidth
 * @param {number} props.snapshotHeight
 */
export default function MediaStreamVideoSnapshot({
  videoRef,
  snapshotWidth,
  snapshotHeight,
  onSnapshot,
}) {
  // NOTE To debounce the snapshot take with delay.
  const [capturing, setCapturing] = useState(false);

  // Actually take the snapshot :P
  const takeSnapshot = useCallback(
    function _takeSnapshot() {
      const video = videoRef.current;
      if (!video) {
        // NOTE: Just skip snapshotting if there is no video.
        setCapturing(false);
        return;
      }
      console.log(
        '[MediaStreamVideoSnapshot] Taking media stream snapshot from video...',
      );
      const canvas = document.createElement('canvas');
      drawElementToCanvasWithRespectToAspectRatio(
        canvas,
        video,
        video.videoWidth || video.width,
        video.videoHeight || video.height,
        snapshotWidth,
        snapshotHeight,
      );
      let result = canvas.toDataURL('image/png', 0.5);
      onSnapshot({ target: video, value: result });
      setCapturing(false);
    },
    [videoRef, snapshotWidth, snapshotHeight, onSnapshot, setCapturing],
  );

  // Delay capture!
  useEffect(() => {
    if (capturing) {
      console.log('[MediaStreamVideoSnapshot] Starting snapshot timeout...');
      const handle = setTimeout(takeSnapshot, 100);
      return () => {
        clearTimeout(handle);
      };
    }
  }, [capturing, takeSnapshot]);

  // Capture when playing...
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    function onPlaying() {
      console.log(
        '[MediaStreamVideoSnapshot] Enable snapshot capturing for live video...',
      );
      setCapturing(true);
    }
    video.addEventListener('playing', onPlaying);
    return () => {
      video.removeEventListener('playing', onPlaying);
    };
  }, [videoRef]);

  return null;
}
