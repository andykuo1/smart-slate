import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFullscreen } from '@/lib/fullscreen';
import { useInputCapture } from '@/lib/inputcapture';
import { isMediaRecorderSupported } from '@/recorder/MediaRecorderSupport';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
import { useSettingsStore } from '@/stores/SettingsStoreContext';
import {
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/UserStoreContext';
import {
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '@/values/RecorderValues';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {import('react').ReactNode} props.children
 */
export default function OpenRecorderButton({
  documentId,
  sceneId,
  shotId,
  className,
  disabled,
  children,
}) {
  const shotRecorder = useShotRecorder(documentId, sceneId, shotId);
  return (
    <button
      className={className}
      title="Record"
      disabled={disabled}
      onClick={shotRecorder}>
      {children}
    </button>
  );
}

/**
 * @param {import('@/stores/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/DocumentStore').ShotId} shotId
 */
function useShotRecorder(documentId, sceneId, shotId) {
  const setUserCursor = useSetUserCursor();
  const preferNativeRecorder = useSettingsStore(
    (ctx) => ctx.user.preferNativeRecorder,
  );

  const mediaRecorderHandler = useMediaRecorderHandler();
  const inputCaptureHandler = useInputCaptureHandler();

  const onRecord = useCallback(
    function onRecord() {
      setUserCursor(documentId, sceneId, shotId, '');

      if (
        isMediaRecorderSupported(
          MEDIA_RECORDER_OPTIONS,
          MEDIA_STREAM_CONSTRAINTS,
        ) &&
        !preferNativeRecorder
      ) {
        mediaRecorderHandler(documentId, sceneId, shotId);
      } else {
        inputCaptureHandler(documentId, sceneId, shotId);
      }
    },
    [
      documentId,
      sceneId,
      shotId,
      mediaRecorderHandler,
      inputCaptureHandler,
      setUserCursor,
      preferNativeRecorder,
    ],
  );

  return onRecord;
}

function useMediaRecorderHandler() {
  const setUserCursor = useSetUserCursor();
  const setRecorderActive = useSetRecorderActive();
  const { enterFullscreen } = useFullscreen();
  const navigate = useNavigate();

  return useCallback(
    /**
     * @param {import('@/stores/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/DocumentStore').ShotId} shotId
     */
    function callMediaRecorderHandler(documentId, sceneId, shotId) {
      setRecorderActive(true, true);
      setUserCursor(documentId, sceneId, shotId);
      enterFullscreen();
      navigate('/rec');
    },
    [setRecorderActive, enterFullscreen, navigate, setUserCursor],
  );
}

function useInputCaptureHandler() {
  const setUserCursor = useSetUserCursor();
  const setRecorderActive = useSetRecorderActive();
  const { startCapturing } = useInputCapture();
  const exportTake = useTakeExporter();

  return useCallback(
    /**
     * @param {import('@/stores/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/DocumentStore').ShotId} shotId
     */
    function callInputCaptureHandler(documentId, sceneId, shotId) {
      setRecorderActive(false, false);
      startCapturing(({ status, data }) => {
        if (!data) {
          return;
        }
        if (status === 'stopped') {
          const takeId = exportTake(data, documentId, sceneId, shotId);
          setUserCursor(documentId, sceneId, shotId, takeId);
        }
      });
    },
    [setRecorderActive, startCapturing, exportTake, setUserCursor],
  );
}
