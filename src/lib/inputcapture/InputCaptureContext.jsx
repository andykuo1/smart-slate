import { createContext, useCallback, useContext, useRef } from 'react';

/**
 * @callback InputCaptureChangeEventHandler
 * @param {object} e
 * @param {'started'|'stopped'} e.status
 * @param {Blob|null} e.data
 */

const InputCaptureContext = createContext(
  /** @type {ReturnType<useInputCaptureContextValue>|null} */ (null),
);

/**
 * @param {import('react').MutableRefObject<HTMLInputElement|null>} inputRef
 * @param {import('react').MutableRefObject<Function|null>} callbackRef
 */
function useInputCaptureContextValue(inputRef, callbackRef) {
  const startCapturing = useCallback(
    /** @param {InputCaptureChangeEventHandler} callback */
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

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function InputCaptureProvider({ children }) {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const callbackRef = useRef(
    /** @type {InputCaptureChangeEventHandler|null} */ (null),
  );

  const handleChange = useCallback(
    /** @type {InputCaptureChangeEventHandler} */
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

export function useInputCaptureV2() {
  let result = useContext(InputCaptureContext);
  if (!result) {
    throw new Error('Missing <InputCaptureProvider/>');
  }
  return result;
}

/**
 * @param {object} props
 * @param {import('react').MutableRefObject<HTMLInputElement|null>} props.inputRef
 * @param {InputCaptureChangeEventHandler} props.onChange
 */
function InputCapture({ inputRef, onChange }) {
  const handleClick = useCallback(
    /** @type {import('react').MouseEventHandler<HTMLInputElement>} */
    function _handleClick(e) {
      onChange({ status: 'started', data: null });
    },
    [onChange],
  );

  const handleChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function _handleChange(e) {
      const el = /** @type {HTMLInputElement} */ (e.target);
      const file = el.files?.[0];
      if (!file) {
        return;
      }
      el.value = '';
      onChange({ status: 'stopped', data: file });
    },
    [onChange],
  );

  return (
    <input
      ref={inputRef}
      className="hidden"
      type="file"
      accept="video/*"
      capture="environment"
      onClick={handleClick}
      onChange={handleChange}
    />
  );
}
