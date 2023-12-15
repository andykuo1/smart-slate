/**
 * @param {object} props
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */
export default function RecordButton({ className, disabled, onClick }) {
  return (
    <button
      className={
        'group mx-2 my-auto' +
        ' ' +
        'text-3xl text-red-400 disabled:text-gray-300' +
        ' ' +
        className
      }
      title="Record"
      disabled={disabled}
      onClick={onClick}>
      ◉
    </button>
  );
}
