import { createContext, useCallback, useContext, useRef } from 'react';

export const MediaRecorderContext = createContext(
  /** @type {ReturnType<useMediaRecorderContextValue>|null} */ (null),
);

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function MediaRecorderProvider({ children }) {
  const callbackRef = useRef(/** @type {Function|null} */ (null));
  const value = useMediaRecorderContextValue(callbackRef);
  return (
    <MediaRecorderContext.Provider value={value}>
      {children}
    </MediaRecorderContext.Provider>
  );
}

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

export function useMediaRecorderV2() {
  let result = useContext(MediaRecorderContext);
  if (!result) {
    throw new Error('Missing <MediaRecorderProvider/>');
  }
  return result;
}
