import { useCallback } from 'react';

/**
 * @callback InputCaptureChangeEventHandler
 * @param {object} e
 * @param {'started'|'stopped'} e.status
 * @param {Blob|null} e.data
 */

/**
 * @param {object} props
 * @param {import('react').MutableRefObject<HTMLInputElement|null>} props.inputRef
 * @param {InputCaptureChangeEventHandler} props.onChange
 */
export default function InputCapture({ inputRef, onChange }) {
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
