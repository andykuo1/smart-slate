import { useEffect } from 'react';

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
  }, [videoRef, onChange]);

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

/**
 * @param {HTMLVideoElement} video
 * @param {Blob} blob
 */
export function setVideoSrcBlob(video, blob) {
  try {
    console.log('[VideoBlobSource] Setting srcObject as ' + blob.type);
    // NOTE: This is a Safari bug :(
    //  https://bugs.webkit.org/show_bug.cgi?id=232076
    //  As a temporary fix, we first try to use srcObject.
    video.srcObject = blob;
  } catch (e) {
    console.log(
      '[VideoBlobSource] Failed to set srcObject to Blob. Trying the old way.',
    );
    // ... then fallback to src when it fails :(
    video.src = URL.createObjectURL(blob);
  }
}
