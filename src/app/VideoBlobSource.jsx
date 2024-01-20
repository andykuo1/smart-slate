import { useEffect } from 'react';

import { setVideoSrcBlob } from './VideoBlobSourceHelper';

/**
 * @callback OnVideoBlobSourceChangeCallback
 * @param {{ target: HTMLVideoElement }} e
 */

/**
 * @param {object} props
 * @param {import('react').MutableRefObject<HTMLVideoElement|null>} props.videoRef
 * @param {import('react').VideoHTMLAttributes<HTMLVideoElement>} [props.videoProps]
 * @param {Blob|null} props.blob
 * @param {OnVideoBlobSourceChangeCallback} [props.onChange]
 */
export default function VideoBlobSource({
  videoRef,
  videoProps,
  blob,
  onChange,
}) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !blob) {
      return;
    }
    setVideoSrcBlob(video, blob);
    video.load();
    return () => {
      const prevSrc = video.currentSrc;
      if (prevSrc) {
        video.src = '';
        URL.revokeObjectURL(prevSrc);
        console.log('[VideoBlobSource] Revoking src blob url.');
      }
    };
  }, [blob, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !blob) {
      return;
    }
    function _onChange() {
      if (!video) {
        return;
      }
      onChange?.({ target: video });
    }
    video.addEventListener('loadedmetadata', _onChange);
    return () => {
      video.removeEventListener('loadedmetadata', _onChange);
    };
  }, [blob, videoRef, onChange]);

  return (
    <video
      ref={videoRef}
      preload="metadata"
      muted={true}
      playsInline={true}
      controls={true}
      {...videoProps}
    />
  );
}
