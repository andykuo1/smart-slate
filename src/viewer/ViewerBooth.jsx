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
      // NOTE: Attempt this first for Safari.
      video.srcObject = blob;
    } catch (e) {
      // NOTE: This is a Safari bug :(
      //  https://bugs.webkit.org/show_bug.cgi?id=232076
      //  As a temporary fix, let's use srcObject.
      video.src = URL.createObjectURL(blob);
    }
    video.load();
    return () => {
      const prevSrc = video.currentSrc;
      if (prevSrc && prevSrc?.startsWith('blob:')) {
        video.src = '';
        URL.revokeObjectURL(prevSrc);
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
          />
        </>
      )}
      center={() => (
        <video ref={videoRef} muted={true} playsInline={true} controls={true} />
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
