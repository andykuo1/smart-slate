import { useCallback, useRef } from 'react';

/** @typedef {(file: File) => void} SingleFileInputChangeHandler */

/**
 * @param {string} accept
 * @param {SingleFileInputChangeHandler} onFile
 * @returns {[() => import('react').ReactNode, import('react').MouseEventHandler<any>]}
 */
export function useSingleFileInput(accept, onFile) {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));

  /** @type {import('react').MouseEventHandler<any>} */
  const click = useCallback(function _handleClick() {
    inputRef.current?.click();
  }, []);

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  const handleChange = useCallback(
    function _handleChange(e) {
      const el = e.target;
      if (!el) {
        return;
      }
      if (el.files && el.files.length > 0) {
        const file = el.files?.[0];
        if (file) {
          onFile(file);
        }
      }
      el.value = '';
    },
    [onFile],
  );

  const render = useCallback(
    function _render() {
      return (
        <input
          className="hidden"
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
        />
      );
    },
    [accept, handleChange],
  );

  return [render, click];
}
