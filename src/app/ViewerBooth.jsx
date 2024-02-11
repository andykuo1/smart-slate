import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import RecorderBoothLayout from '@/recorder/RecorderBoothLayout';
import RecorderBoothTitle from '@/recorder/RecorderBoothTitle';
import { useCachedVideoBlob } from '@/recorder/cache';
import { useCurrentCursor, useCurrentDocumentId } from '@/stores/user';

import VideoBlobSource from './VideoBlobSource';

export default function ViewerBooth() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const navigate = useNavigate();
  const documentId = useCurrentDocumentId();
  const { sceneId, shotId, takeId } = useCurrentCursor();
  const blob = useCachedVideoBlob(documentId, takeId || '');

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
      center={() => <VideoBlobSource videoRef={videoRef} blob={blob} />}
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
    <button
      className={'mx-2 rounded-full bg-white px-2 text-black' + ' ' + className}
      onClick={onClick}>
      {'<-'}Back
    </button>
  );
}
