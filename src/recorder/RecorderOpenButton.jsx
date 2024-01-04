import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFullscreen } from '@/libs/fullscreen';
import { useInputCapture } from '@/libs/inputcapture';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
import { useSettingsStore } from '@/stores/settings';
import { useSetRecorderActive, useSetUserCursor } from '@/stores/user';

import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function RecorderOpenButton({ className, children, onClick }) {
  const openRecorder = useOpenRecorder(onClick);
  const openInputCapture = useOpenInputCapture(onClick);
  const preferNativeRecorder = useSettingsStore(
    (ctx) => ctx.user.preferNativeRecorder,
  );

  /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
  function handleClick(e) {
    if (!preferNativeRecorder) {
      openRecorder(e);
    } else {
      openInputCapture(e);
    }
  }

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}

/**
 * @param {import('react').MouseEventHandler<any>} [onClick]
 */
function useOpenRecorder(onClick) {
  const { onStart, onStop } = useContext(RecorderContext);
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const navigate = useNavigate();
  return useCallback(
    /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
    async function _handleClick(e) {
      try {
        // Step 1. Get all the permissions :P
        await onStart({
          restart: true,
          record: false,
          mediaStreamConstraints: [
            {
              video: { facingMode: 'environment' },
              audio: true,
            },
          ],
        });
        // Step 2. Do something in the middle.
        onClick?.(e);
        // Step 3. Navigate to page.
        enterFullscreen();
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
    [onStart, onStop, navigate, enterFullscreen, exitFullscreen, onClick],
  );
}

/**
 * @param {import('react').MouseEventHandler<any>} [onClick]
 */
function useOpenInputCapture(onClick) {
  const setUserCursor = useSetUserCursor();
  const setRecorderActive = useSetRecorderActive();
  const { startCapturing } = useInputCapture();
  const exportTake = useTakeExporter();
  return useCallback(
    /** @type {import('react').MouseEventHandler<any>} */
    function _handleClick(e) {
      startCapturing(({ status, data }) => {
        if (!data) {
          return;
        }
        if (status === 'stopped') {
          onClick?.(e);
        }
      });
    },
    [setRecorderActive, startCapturing, exportTake, setUserCursor],
  );
}
