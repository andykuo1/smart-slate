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
        'm-2 block rounded bg-gray-100 p-2 outline' +
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
