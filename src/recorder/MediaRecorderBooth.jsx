import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ShotThumbnail from '@/components/shots/ShotThumbnail';
import { useAnimationFrame } from '@/lib/animationframe';
import { useFullscreen } from '@/lib/fullscreen';
import { shotNumberToChar } from '@/stores/DocumentStore';
import {
  useSceneHeading,
  useShotNumber,
  useShotTakeCount,
} from '@/stores/DocumentStoreContext';
import { useSettingsStore } from '@/stores/SettingsStoreContext';
import { useCurrentCursor } from '@/stores/UserStoreContext';
import '@/values/RecorderValues';

import { MediaRecorderContext } from './MediaRecorderContext';
import VideoRecorderBoothLayout from './VideoRecorderBoothLayout';

export default function MediaRecorderBooth() {
  const { documentId, sceneId, shotId } = useCurrentCursor();
  const takeCount = useShotTakeCount(documentId, shotId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const sceneHeading = useSceneHeading(documentId, sceneId);
  const preferPersistedMediaStream = useSettingsStore(
    (ctx) => ctx.user.preferPersistedMediaStream,
  );
  const navigate = useNavigate();
  const { exitFullscreen } = useFullscreen();

  const { videoRef, onStart, onStop, isPrepared, isRecording } =
    useContext(MediaRecorderContext);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.endsWith('/rec')) {
      onStart({ record: false });
    } else {
      onStop({ exit: !preferPersistedMediaStream });
    }
  }, [preferPersistedMediaStream, location, onStart, onStop]);

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
          active={isPrepared && isRecording}
        />
      )}
      bottom={() => (
        <>
          <BackButton
            onClick={() => {
              onStop({ exit: !preferPersistedMediaStream }).then(() => {
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
 * @param {boolean} props.active
 */
function VideoFrame({
  className,
  videoRef,
  documentId,
  sceneId,
  shotId,
  active,
}) {
  const preferMutedWhileRecording = useSettingsStore(
    (ctx) => ctx.user.preferMutedWhileRecording,
  );
  const enableThumbnailWhileRecording = useSettingsStore(
    (ctx) => ctx.user.enableThumbnailWhileRecording,
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
      <div className="absolute right-0 bottom-0">
        <RecordingTime active={active} />
      </div>
    </>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} props.active
 */
function RecordingTime({ className, active }) {
  const [startTime, setStartTime] = useState(-1);
  const [timeString, setTimeString] = useState('');
  useEffect(() => {
    if (active && startTime < 0) {
      setStartTime(Date.now());
    } else if (!active) {
      setStartTime(-1);
    }
  }, [active]);

  const onAnimationFrame = useCallback(
    function _onAnimationFrame() {
      if (startTime > 0) {
        const duration = Date.now() - startTime;
        setTimeString(getTimeString(duration));
      }
    },
    [startTime],
  );
  useAnimationFrame(onAnimationFrame);
  return (
    <output
      className={
        'rounded p-1 font-mono transition-colors' +
        ' ' +
        (active ? 'bg-red-400' : 'bg-black') +
        ' ' +
        className
      }>
      {startTime > 0 ? timeString : '00:00:00'}
    </output>
  );
}

/**
 * @param {number} durationMillis
 */
function getTimeString(durationMillis) {
  const seconds = Math.floor((durationMillis / 1000) % 60);
  const minutes = Math.floor((durationMillis / (1000 * 60)) % 60);
  const hours = Math.floor((durationMillis / (1000 * 60 * 60)) % 24);
  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0')
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
