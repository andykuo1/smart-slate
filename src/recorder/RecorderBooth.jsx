import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ShotThumbnail from '@/components/shots/ShotThumbnail';
import { useFullscreen } from '@/libs/fullscreen';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
import {
  getDocumentSettingsById,
  useDocumentStore,
  useSetTakePreviewImage,
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
import RecorderBoothTitle from './RecorderBoothTitle';
import { RecorderContext } from './RecorderContext';
import RecorderToolbar from './RecorderToolbar';

/** @type {MediaTrackConstraints} */
const DEFAULT_VIDEO_CONSTRAINTS = {
  facingMode: 'environment',
  width: { ideal: STANDARD_VIDEO_RESOLUTIONS['1080p'].width },
  height: { ideal: STANDARD_VIDEO_RESOLUTIONS['1080p'].height },
  aspectRatio: { ideal: STANDARD_VIDEO_RESOLUTIONS['1080p'].ratio },
  // @ts-expect-error Safari supports 'zoom'.
  zoom: { ideal: 1.1 },
};

export default function RecorderBooth() {
  const userCursor = useCurrentCursor();
  const { documentId, sceneId, shotId } = userCursor;
  const preferPersistedMediaStream = useSettingsStore(
    (ctx) => ctx.user.preferPersistedMediaStream,
  );
  const preferMutedWhileRecording = useSettingsStore(
    (ctx) => ctx.user.preferMutedWhileRecording,
  );
  const enableThumbnailWhileRecording = useSettingsStore(
    (ctx) => ctx.user.enableThumbnailWhileRecording,
  );
  const isAspectRatio43 = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.aspectRatio,
  );
  const navigate = useNavigate();
  const { exitFullscreen } = useFullscreen();
  const setTakePreviewImage = useSetTakePreviewImage();
  const exportTake = useTakeExporter();
  const setUserCursor = useSetUserCursor();
  const [_, setVideoSnapshotURL] = useState('');
  const [videoConstraints, setVideoConstraints] = useState(
    DEFAULT_VIDEO_CONSTRAINTS,
  );
  const [__, setAudioConstraints] = useState(
    /** @type {MediaTrackConstraints} */ ({}),
  );

  const { videoRef, onStop } = useContext(RecorderContext);

  const onVideoConstraintsChange = useCallback(
    /**
     * @param {MediaTrackConstraints} constraints
     */
    function _onVideoConstraintsChange(constraints) {
      setVideoConstraints((prev) => ({
        ...prev,
        ...constraints,
      }));
    },
    [setVideoConstraints],
  );

  const onAudioConstraintsChange = useCallback(
    /**
     * @param {MediaTrackConstraints} constraints
     */
    function _onAudioConstraintsChange(constraints) {
      setAudioConstraints((prev) => ({
        ...prev,
        ...constraints,
      }));
    },
    [setAudioConstraints],
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
          <RecorderBoothTitle
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
          />
        </>
      )}
      center={() => (
        <>
          <MediaStreamVideoConstraints constraints={videoConstraints} />
          <MediaStreamVideoView
            videoRef={videoRef}
            muted={preferMutedWhileRecording}
          />
          <MediaStreamVideoSnapshot
            videoRef={videoRef}
            snapshotWidth={MAX_THUMBNAIL_WIDTH}
            snapshotHeight={MAX_THUMBNAIL_HEIGHT}
            onSnapshot={(e) => setVideoSnapshotURL(e.value)}
          />
          {/* 4:3 box */}
          {isAspectRatio43 && (
            <div className="absolute mx-auto left-0 right-0 -top-1 -bottom-1 w-[75%] border-x-4 pointer-events-none" />
          )}
          {enableThumbnailWhileRecording && (
            <div className="absolute left-0 bottom-0">
              <ShotThumbnail
                className="shadow-md"
                documentId={documentId}
                sceneId={sceneId}
                shotId={shotId}
                editable={false}
                referenceOnly={true}
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
          onVideoConstraintsChange={onVideoConstraintsChange}
          onAudioConstraintsChange={onAudioConstraintsChange}
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
    <button
      className={'rounded-full mx-2 px-2 bg-white text-black' + ' ' + className}
      onClick={onClick}>
      {'<-'}Back
    </button>
  );
}
