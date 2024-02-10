/**
 * @param {object} props
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {boolean} [props.disabled]
 * @param {import('react').ReactNode} props.children
 */
export default function TestButton({ onClick, disabled = !onClick, children }) {
  return (
    <button
      className={
        'block outline rounded p-2 m-2 bg-gray-100' +
        ' ' +
        'enabled:hover:bg-black enabled:hover:text-white enabled:hover:outline-white' +
        ' ' +
        'disabled:opacity-30'
      }
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
}
