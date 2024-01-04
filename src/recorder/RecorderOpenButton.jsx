import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFullscreen } from '@/libs/fullscreen';

import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function RecorderOpenButton({ className, children, onClick }) {
  const { onStart, onStop } = useContext(RecorderContext);
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const navigate = useNavigate();

  const handleClick = useCallback(
    /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
    async function _handleClick(e) {
      try {
        // Step 1. Get all the permissions :P
        await onStart({
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

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
