import { useEffect, useRef, useState } from 'react';

import { useFormattedTextState } from '../../UseTextToBlockSerializer';
import BlockContentTextAreaStyle from './BlockContentTextArea.module.css';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.text
 * @param {import('@/stores/document/DocumentStore').BlockContentStyle} props.type
 * @param {string} props.placeholder
 * @param {(value: string) => void} props.onChange
 */
export default function BlockContentTextArea({
  className,
  text,
  type,
  placeholder,
  onChange,
}) {
  const [state, setState] = useFormattedTextState(text, type);
  const [height, setHeight] = useState(0);
  const inputRef = useRef(/** @type {HTMLTextAreaElement|null} */ (null));

  /** @type {import('react').ChangeEventHandler<HTMLTextAreaElement>} */
  function handleChange(e) {
    const target = e.target;
    if (!target) {
      return;
    }
    setState(target.value);
    setHeight(target.scrollHeight);
  }

  /** @type {import('react').FocusEventHandler<HTMLTextAreaElement>} */
  function handleFocus(e) {
    const target = e.target;
    if (!target) {
      return;
    }
    target.style.setProperty('--initialHeight', `${target.scrollHeight}px`);
    setHeight(target.scrollHeight);

    // Focus at end of line.
    const inputLength = target.value.length;
    target.setSelectionRange(inputLength, inputLength);
  }

  /** @type {import('react').FocusEventHandler<HTMLTextAreaElement>} */
  function handleBlur(e) {
    const target = e.target;
    if (!target) {
      return;
    }
    target.style.setProperty('--initialHeight', '0px');
    onChange(e.target.value);
  }

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    // Always grab focus when active.
    input.focus({ preventScroll: true });
  });

  return (
    <textarea
      ref={inputRef}
      className={
        'resize-none bg-transparent outline-none' +
        ' ' +
        BlockContentTextAreaStyle.textArea +
        ' ' +
        className
      }
      style={{ height: `${height}px` }}
      value={state}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
}
