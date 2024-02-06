import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFullscreen } from '@/libs/fullscreen';
import { useInputCapture } from '@/libs/inputcapture';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
import { useSettingsStore } from '@/stores/settings';
import {
  useCurrentCursor,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';

import { RecorderContext } from './RecorderContext';

/**
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [onClick]
 */
export function useOpenPreferredRecorder(onClick) {
  const openMediaRecorder = useOpenMediaRecorder(onClick);
  const openInputCapture = useOpenInputCapture(onClick);
  const preferNativeRecorder = useSettingsStore(
    (ctx) => ctx.user.preferNativeRecorder,
  );

  /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
  function handleClick(e) {
    if (!preferNativeRecorder) {
      openMediaRecorder(e);
    } else {
      openInputCapture(e);
    }
  }

  return handleClick;
}

/**
 * @param {import('react').MouseEventHandler<any>} [onClick]
 */
function useOpenMediaRecorder(onClick) {
  const { onStop, initMediaStream } = useContext(RecorderContext);
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const preferFullscreenRecorder = useSettingsStore(
    (ctx) => ctx.user.preferFullscreenRecorder,
  );
  const navigate = useNavigate();
  const preferPersistedMediaStream = useSettingsStore(
    (ctx) => ctx.user.preferPersistedMediaStream,
  );
  const setRecordMode = useUserStore((ctx) => ctx.setRecordMode);
  return useCallback(
    /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
    async function _handleClick(e) {
      try {
        // Step 1. Get all the permissions :P
        await initMediaStream(
          {
            video: { facingMode: 'environment', aspectRatio: 16 / 9 },
            audio: true,
          },
          !preferPersistedMediaStream,
        );
        // Step 2. Do something in the middle.
        onClick?.(e);
        // Step 3. Navigate to page.
        if (preferFullscreenRecorder) {
          enterFullscreen();
        }
        setRecordMode('recorder');
        navigate('/rec');
      } catch (e) {
        // ... report it.
        if (e instanceof Error) {
          window.alert(`${e.name}: ${e.message}`);
        } else {
          console.error(JSON.stringify(e));
        }
        // ... and stop everything if it failed.
        exitFullscreen();
        await onStop({ exit: true });
      }
    },
    [
      preferPersistedMediaStream,
      preferFullscreenRecorder,
      setRecordMode,
      initMediaStream,
      onStop,
      navigate,
      enterFullscreen,
      exitFullscreen,
      onClick,
    ],
  );
}

/**
 * @param {import('react').MouseEventHandler<any>} [onClick]
 */
function useOpenInputCapture(onClick) {
  const { startCapturing } = useInputCapture();
  const exportTake = useTakeExporter();
  const userCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();

  const onComplete = useCallback(
    /**
     * @param {Blob} data
     */
    async function onComplete(data) {
      const { documentId, sceneId, shotId } = userCursor;
      const takeId = exportTake(data, documentId, sceneId, shotId);
      setUserCursor(documentId, sceneId, shotId, takeId);
    },
    [userCursor, exportTake, setUserCursor],
  );

  return useCallback(
    /** @type {import('react').MouseEventHandler<any>} */
    function _handleClick(e) {
      startCapturing(({ status, data }) => {
        if (!data) {
          return;
        }
        onComplete(data);
      });
      onClick?.(e);
    },
    [onClick, onComplete, startCapturing],
  );
}
