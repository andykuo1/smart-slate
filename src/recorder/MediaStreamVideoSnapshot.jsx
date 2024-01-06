import { useContext, useEffect } from 'react';

import { RecorderContext } from './RecorderContext';
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
  const { mediaRecorder } = useContext(RecorderContext);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (!mediaRecorder) {
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
  }, [videoRef, snapshotWidth, snapshotHeight, mediaRecorder, onSnapshot]);

  return null;
}
