import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import RecorderBoothLayout from '@/recorder/RecorderBoothLayout';
import RecorderBoothTitle from '@/recorder/RecorderBoothTitle';
import { useCachedVideoBlob } from '@/recorder/cache';
import { useCurrentCursor, useCurrentDocumentId } from '@/stores/user';

export default function ViewerBooth() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const navigate = useNavigate();
  const documentId = useCurrentDocumentId();
  const { sceneId, shotId, takeId } = useCurrentCursor();
  const blob = useCachedVideoBlob(documentId, takeId || '');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !blob) {
      return;
    }
    try {
      console.log('[ViewerBooth] Setting srcObject as ' + blob.type);
      // NOTE: This is a Safari bug :(
      //  https://bugs.webkit.org/show_bug.cgi?id=232076
      //  As a temporary fix, we first try to use srcObject.
      video.srcObject = blob;
    } catch (e) {
      console.log(
        '[ViewerBooth] Failed to set srcObject to Blob. Trying the old way.',
      );
      // ... then fallback to src when it fails :(
      video.src = URL.createObjectURL(blob);
    }
    video.load();
    return () => {
      const prevSrc = video.currentSrc;
      if (prevSrc) {
        video.src = '';
        URL.revokeObjectURL(prevSrc);
        console.log('[ViewerBooth] Revoking src blob url.');
      }
    };
  }, [blob, videoRef]);

  return (
    <RecorderBoothLayout
      className="text-white"
      videoRef={videoRef}
      top={() => (
        <>
          <BackButton onClick={() => navigate('/edit')} />
          <RecorderBoothTitle
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            takeId={takeId}
          />
        </>
      )}
      center={() => (
        <video
          ref={videoRef}
          preload="metadata"
          muted={true}
          playsInline={true}
          controls={true}
        />
      )}
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 */
function BackButton({ className, onClick }) {
  return (
    <button className={'rounded mx-2' + ' ' + className} onClick={onClick}>
      {'<-'}Back
    </button>
  );
}
