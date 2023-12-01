'use client';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {boolean} props.disabled
 * @param {import('react').MouseEventHandler} props.onClick
 */
export default function Button({ title, disabled = false, onClick }) {
  return (
    <button className="border-2 m-2 p-2"
      title={title}
      disabled={disabled}
      onClick={onClick}>
      {title}
    </button>
  );
}
