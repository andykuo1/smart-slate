'use client';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {import('react').MouseEventHandler} props.onClick
 */
export default function Button({
  title,
  className = '',
  disabled = false,
  onClick,
}) {
  return (
    <button
      className={'border-2 m-2 p-2 disabled:opacity-30' + ' ' + className}
      title={title}
      disabled={disabled}
      onClick={onClick}>
      {title}
    </button>
  );
}
