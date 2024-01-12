import { useCallback, useRef } from 'react';

/** @typedef {(files: FileList) => void} MultiFileInputChangeHandler */

/**
 * @param {string} accept
 * @param {MultiFileInputChangeHandler} onFiles
 * @returns {[() => import('react').ReactNode, import('react').MouseEventHandler<any>]}
 */
export function useMultiFileInput(accept, onFiles) {
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
        onFiles(el.files);
      }
      el.value = '';
    },
    [onFiles],
  );

  const render = useCallback(
    function _render() {
      return (
        <input
          className="hidden"
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={true}
          onChange={handleChange}
        />
      );
    },
    [accept, handleChange],
  );

  return [render, click];
}
