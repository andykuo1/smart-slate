import { useCallback, useContext, useEffect } from 'react';

import { RecorderContext } from './RecorderContext';

/**
 *
 * @param {object} props
 * @param {import('react').RefObject<HTMLVideoElement>} props.videoRef
 * @param {string} [props.className]
 * @param {boolean} [props.muted]
 * @returns
 */
export default function MediaStreamVideoView({
  className,
  videoRef,
  muted = true,
}) {
  const { mediaStream } = useContext(RecorderContext);

  const onClick = useCallback(
    function _onClick() {
      // Reload the video (in-case it got stuck)
      const video = videoRef.current;
      if (!video) {
        return;
      }
      if (mediaStream) {
        // Add stream to output video
        if (!video.srcObject) {
          video.srcObject = mediaStream;
        }
        video.play();
      } else {
        // Remove stream from output video
        video.pause();
        if (video.srcObject) {
          video.srcObject = null;
        }
      }
    },
    [mediaStream, videoRef],
  );

  useEffect(() => {
    onClick();
  }, [onClick]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      playsInline={true}
      onClick={onClick}
    />
  );
}
