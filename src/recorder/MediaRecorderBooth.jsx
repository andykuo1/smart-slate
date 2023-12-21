import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ShotThumbnail from '@/components/shotlist/ShotThumbnail';
import { useFullscreen } from '@/lib/fullscreen';
import { useRecorderV2 } from '@/recorder/UseRecorderV2';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
import { shotNumberToChar } from '@/stores/DocumentStore';
import {
  useSceneHeading,
  useShotNumber,
  useShotTakeCount,
} from '@/stores/DocumentStoreContext';
import {
  useCurrentCursor,
  usePreferMutedWhileRecording,
  useSetUserCursor,
  useUserStore,
} from '@/stores/UserStoreContext';
import '@/values/RecorderValues';
import {
  MEDIA_BLOB_OPTIONS,
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '@/values/RecorderValues';

import VideoRecorderBoothLayout from './VideoRecorderBoothLayout';

export default function MediaRecorderBooth() {
  const { documentId, sceneId, shotId } = useCurrentCursor();
  const takeCount = useShotTakeCount(documentId, shotId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const sceneHeading = useSceneHeading(documentId, sceneId);
  const setUserCursor = useSetUserCursor();
  const exportTake = useTakeExporter();
  const navigate = useNavigate();
  const { exitFullscreen } = useFullscreen();
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));

  /** @type {import('@/recorder/UseMediaRecorder').MediaRecorderCompleteCallback} */
  const onComplete = useCallback(
    function _onComplete(blob, mediaRecorder) {
      const takeId = exportTake(blob, documentId, sceneId, shotId);
      setUserCursor(documentId, sceneId, shotId, takeId);
    },
    [exportTake, setUserCursor, navigate, exitFullscreen],
  );

  const { onStart, onStop, isPrepared, isRecording } = useRecorderV2(
    videoRef,
    MEDIA_STREAM_CONSTRAINTS,
    MEDIA_RECORDER_OPTIONS,
    MEDIA_BLOB_OPTIONS,
    onComplete,
  );

  useEffect(() => {
    if (!isPrepared) {
      onStart({ record: false });
    }
  }, []);

  return (
    <VideoRecorderBoothLayout
      className="text-white"
      videoRef={videoRef}
      top={() => (
        <>
          <span className="mx-2">{sceneHeading || 'INT/EXT. SCENE - DAY'}</span>
          <span className="flex-1" />
          <span>Shot {shotNumberToChar(shotNumber)}</span>
          <span className="flex flex-row items-center mx-2">
            Take #{takeCount + 1}
            <RecordingSignal active={isPrepared && isRecording} />
          </span>
        </>
      )}
      center={({ className }) => (
        <VideoFrame
          className={'border-4' + ' ' + className}
          videoRef={videoRef}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
      )}
      bottom={() => (
        <>
          <BackButton
            onClick={() => {
              onStop({ exit: true }).then(() => {
                exitFullscreen();
                navigate('/edit');
              });
            }}
          />
          <div className="flex-1" />
          <RecordAndCutButton
            canCut={isPrepared && isRecording}
            canRec={isPrepared && !isRecording}
            onClick={() => {
              if (!isPrepared) {
                return;
              }
              if (!isRecording) {
                onStart({ record: true });
              } else {
                onStop({ exit: false });
              }
            }}
          />
        </>
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

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLVideoElement|null>} props.videoRef
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function VideoFrame({ className, videoRef, documentId, sceneId, shotId }) {
  const preferMutedWhileRecording = usePreferMutedWhileRecording();
  const enableThumbnailWhileRecording = useUserStore(
    (ctx) => ctx.settings.enableThumbnailWhileRecording,
  );

  return (
    <>
      <video
        ref={videoRef}
        className={className}
        muted={preferMutedWhileRecording}
      />
      {enableThumbnailWhileRecording && (
        <div className="absolute left-0 bottom-0">
          <ShotThumbnail
            className="shadow-md"
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            editable={false}
          />
        </div>
      )}
    </>
  );
}

/**
 * @param {object} props
 * @param {boolean} props.active
 */
function RecordingSignal({ active }) {
  return (
    <div
      className={
        'inline-block mx-2 w-[1rem] h-[1rem] rounded-full border-2' +
        ' ' +
        (active ? 'bg-red-500 border-red-500' : 'bg-black border-white')
      }
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} props.canCut
 * @param {boolean} props.canRec
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 */
function RecordAndCutButton({ className, canCut, canRec, onClick }) {
  return (
    <button
      className={'flex flex-row items-center mx-2' + ' ' + className}
      onClick={onClick}>
      <span
        className={
          'text-xl text-white' + ' ' + (canCut ? 'opacity-100' : 'opacity-30')
        }>
        cut
      </span>
      <span className="mx-2 text-3xl text-red-400">◉</span>
      <span
        className={
          'text-xl text-red-400' + ' ' + (canRec ? 'opacity-100' : 'opacity-30')
        }>
        rec
      </span>
    </button>
  );
}
