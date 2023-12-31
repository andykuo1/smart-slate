import { useCallback } from 'react';

/**
 * @param {import('react').MutableRefObject<HTMLInputElement|null>} inputRef
 * @param {import('react').MutableRefObject<Function|null>} callbackRef
 */
export function useInputCaptureContextValue(inputRef, callbackRef) {
  const startCapturing = useCallback(
    /** @param {import('./InputCapture').InputCaptureChangeEventHandler} callback */
    function startCapturing(callback) {
      callbackRef.current = callback;
      inputRef.current?.click();
    },
    [inputRef, callbackRef],
  );
  return {
    startCapturing,
  };
}
