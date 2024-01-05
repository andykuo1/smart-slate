import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ShotThumbnail from '@/components/shots/ShotThumbnail';
import { useAnimationFrame } from '@/libs/animationframe';
import { useFullscreen } from '@/libs/fullscreen';
import {
  useSceneHeading,
  useShotNumber,
  useShotTakeCount,
} from '@/stores/document';
import { shotNumberToChar } from '@/stores/document/DocumentStore';
import { useSettingsStore } from '@/stores/settings';
import { useCurrentCursor } from '@/stores/user';
import { formatHourMinSecTime } from '@/utils/StringFormat';
import '@/values/RecorderValues';

import RecorderBoothLayout from './RecorderBoothLayout';
import { RecorderContext } from './RecorderContext';
import RecorderToolbar from './RecorderToolbar';

export default function RecorderBooth() {
  const { documentId, sceneId, shotId } = useCurrentCursor();
  const takeCount = useShotTakeCount(documentId, shotId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const [sceneHeading] = useSceneHeading(documentId, sceneId);
  const preferPersistedMediaStream = useSettingsStore(
    (ctx) => ctx.user.preferPersistedMediaStream,
  );
  const navigate = useNavigate();
  const { exitFullscreen } = useFullscreen();

  const { videoRef, onStop, isPrepared, isRecording } =
    useContext(RecorderContext);

  return (
    <RecorderBoothLayout
      className="text-white"
      videoRef={videoRef}
      top={() => (
        <>
          <BackButton
            onClick={() => {
              onStop({
                exit: !preferPersistedMediaStream,
              }).then(() => {
                exitFullscreen();
                navigate('/edit');
              });
            }}
          />
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
          <div className="flex-1" />
          <RecordingTime active={isPrepared && isRecording} />
          <div className="flex-1" />
        </>
      )}
      right={() => <RecorderToolbar />}
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
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
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
        playsInline={true}
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
  }, [active, startTime]);

  const onAnimationFrame = useCallback(
    function _onAnimationFrame() {
      if (startTime > 0) {
        setTimeString(formatHourMinSecTime(Date.now() - startTime));
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
