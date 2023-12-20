import { useCallback } from 'react';

/**
 * @param {import('react').MutableRefObject<Function|null>} callbackRef
 */
export function useMediaRecorderContextValue(callbackRef) {
  const startRecording = useCallback(
    /** @param {import('@/components/recorder/RecorderPanel').MediaRecorderChangeEventHandler} callback */
    function _startRecording(callback) {
      callbackRef.current = callback;
    },
    [callbackRef],
  );
  const handleChange = useCallback(
    /** @type {import('@/components/recorder/RecorderPanel').MediaRecorderChangeEventHandler} */
    function _handleChange(e) {
      callbackRef.current?.(e);
      if (e.status === 'stopped') {
        callbackRef.current = null;
      }
    },
    [callbackRef],
  );
  return {
    startRecording,
    handleChange,
  };
}
