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
        'group w-[1.5rem] h-[1.5rem] mx-4 my-auto rounded-full' +
        ' ' +
        'border-2 border-red-400 bg-transparent disabled:border-gray-300' +
        ' ' +
        className
      }
      title="Record"
      disabled={disabled}
      onClick={onClick}>
      <div
        className={
          'w-[1rem] h-[1rem] rounded-full m-auto bg-red-400 group-disabled:bg-gray-300'
        }
      />
    </button>
  );
}
