/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {boolean} [props.disabled]
 * @param {import('react').ReactNode} props.children
 */
export default function DocumentDivider({
  className,
  onClick,
  disabled = !onClick,
  children,
}) {
  return (
    <div
      className={
        'w-full flex flex-row items-center px-4 my-4' +
        ' ' +
        (disabled ? 'opacity-30' : '') +
        ' ' +
        className
      }>
      <span className="flex-1 text-center border-t-2 border-dotted border-black" />
      <button
        className="mx-4 flex flex-row"
        onClick={onClick}
        disabled={disabled}>
        {children}
      </button>
      <span className="flex-1 text-center border-t-2 border-dotted border-black" />
    </div>
  );
}
