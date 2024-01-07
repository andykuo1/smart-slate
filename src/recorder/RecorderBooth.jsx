import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ShotThumbnail from '@/components/shots/ShotThumbnail';
import { formatShotNumber } from '@/components/takes/TakeNameFormat';
import { useFullscreen } from '@/libs/fullscreen';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
import {
  useSceneHeading,
  useSetTakePreviewImage,
  useShotNumber,
  useShotTakeCount,
} from '@/stores/document';
import { useSettingsStore } from '@/stores/settings';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
  STANDARD_VIDEO_RESOLUTIONS,
} from '@/values/Resolutions';

import MediaRecorderRecordingTime from './MediaRecorderRecordingTime';
import MediaStreamVideoConstraints from './MediaStreamVideoConstraints';
import MediaStreamVideoSnapshot from './MediaStreamVideoSnapshot';
import MediaStreamVideoView from './MediaStreamVideoView';
import RecorderBoothLayout from './RecorderBoothLayout';
import { RecorderContext } from './RecorderContext';
import RecorderToolbar from './RecorderToolbar';

export default function RecorderBooth() {
  const userCursor = useCurrentCursor();
  const { documentId, sceneId, shotId } = userCursor;
  const takeCount = useShotTakeCount(documentId, shotId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const [sceneHeading] = useSceneHeading(documentId, sceneId);
  const preferPersistedMediaStream = useSettingsStore(
    (ctx) => ctx.user.preferPersistedMediaStream,
  );
  const preferMutedWhileRecording = useSettingsStore(
    (ctx) => ctx.user.preferMutedWhileRecording,
  );
  const enableThumbnailWhileRecording = useSettingsStore(
    (ctx) => ctx.user.enableThumbnailWhileRecording,
  );
  const navigate = useNavigate();
  const { exitFullscreen } = useFullscreen();
  const setTakePreviewImage = useSetTakePreviewImage();
  const exportTake = useTakeExporter();
  const setUserCursor = useSetUserCursor();
  const [_, setVideoSnapshotURL] = useState('');
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: 'environment',
    width: { ideal: STANDARD_VIDEO_RESOLUTIONS['1080p'].width },
    height: { ideal: STANDARD_VIDEO_RESOLUTIONS['1080p'].height },
    aspectRatio: { ideal: STANDARD_VIDEO_RESOLUTIONS['1080p'].ratio },
  });

  const { videoRef, onStop } = useContext(RecorderContext);

  const onVideoResolutionChange = useCallback(
    /**
     * @param {import('@/values/Resolutions').VideoResolution} resolution
     */
    function _onVideoResolutionChange(resolution) {
      setVideoConstraints((prev) => ({
        ...prev,
        width: { ideal: resolution.width },
        height: { ideal: resolution.height },
        aspectRatio: { ideal: resolution.ratio },
      }));
    },
    [setVideoConstraints],
  );

  const onComplete = useCallback(
    /**
     * @param {Blob} blob
     */
    function _onComplete(blob) {
      const { documentId, sceneId, shotId } = userCursor;
      const takeId = exportTake(blob, documentId, sceneId, shotId);
      setVideoSnapshotURL((prev) => {
        if (prev) {
          console.log(
            '[RecorderBooth] Setting the snapshot for url with length ' +
              prev?.length,
          );
          setTakePreviewImage(documentId, takeId, prev);
        }
        // Reset preview image :)
        console.log('[RecorderBooth] Now resetting.');
        return '';
      });
      setUserCursor(documentId, sceneId, shotId, takeId);
    },
    [
      userCursor,
      exportTake,
      setUserCursor,
      setVideoSnapshotURL,
      setTakePreviewImage,
    ],
  );

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
          <span>Shot {formatShotNumber(shotNumber)}</span>
          <span className="flex flex-row items-center mx-2">
            Take #{takeCount + 1}
          </span>
        </>
      )}
      center={({ className }) => (
        <>
          <MediaStreamVideoConstraints constraints={videoConstraints} />
          <MediaStreamVideoView
            videoRef={videoRef}
            className={'border-4' + ' ' + className}
            muted={preferMutedWhileRecording}
          />
          <MediaStreamVideoSnapshot
            videoRef={videoRef}
            snapshotWidth={MAX_THUMBNAIL_WIDTH}
            snapshotHeight={MAX_THUMBNAIL_HEIGHT}
            onSnapshot={(e) => setVideoSnapshotURL(e.value)}
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
      )}
      bottom={() => (
        <>
          <div className="flex-1" />
          <MediaRecorderRecordingTime />
          <div className="flex-1" />
        </>
      )}
      right={() => (
        <RecorderToolbar
          onComplete={onComplete}
          onResolutionChange={onVideoResolutionChange}
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
