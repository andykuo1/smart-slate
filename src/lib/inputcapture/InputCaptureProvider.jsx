import { useCallback, useRef } from 'react';

import InputCapture from './InputCapture';
import { InputCaptureContext } from './InputCaptureContext';
import { useInputCaptureContextValue } from './UseInputCaptureContextValue';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function InputCaptureProvider({ children }) {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const callbackRef = useRef(
    /** @type {import('./InputCapture').InputCaptureChangeEventHandler|null} */ (
      null
    ),
  );

  const handleChange = useCallback(
    /** @type {import('./InputCapture').InputCaptureChangeEventHandler} */
    function _handleChange(e) {
      callbackRef.current?.(e);
      if (e.status === 'stopped') {
        callbackRef.current = null;
      }
    },
    [callbackRef],
  );

  const value = useInputCaptureContextValue(inputRef, callbackRef);
  return (
    <InputCaptureContext.Provider value={value}>
      <InputCapture inputRef={inputRef} onChange={handleChange} />
      {children}
    </InputCaptureContext.Provider>
  );
}
