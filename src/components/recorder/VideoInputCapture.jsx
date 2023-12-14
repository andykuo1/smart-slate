import { useCallback, useRef } from 'react';

/**
 * @param {object} props
 * @param {import('react').RefObject<HTMLInputElement>} props.inputRef
 * @param {import('./RecorderPanel').MediaRecorderChangeEventHandler} props.onChange
 */
export function VideoInputCapture({ inputRef, onChange }) {
  const onChangeImpl = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function _onChangeImpl(e) {
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
      onChange={onChangeImpl}
    />
  );
}

export function useInputCapture() {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const startCapturing = useCallback(
    function startCapturing() {
      inputRef.current?.click();
    },
    [inputRef],
  );
  return {
    inputRef,
    startCapturing,
  };
}
