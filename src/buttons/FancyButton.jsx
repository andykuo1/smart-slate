/**
 * @param {object} props
 * @param {string} [props.title]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {string|import('react').ReactNode} [props.label]
 * @param {import('react').ReactNode} [props.children]
 */
export default function FancyButton({
  title = '',
  onClick,
  className,
  label = title,
  disabled = !onClick,
  children,
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={
        'group flex flex-row items-center' +
        ' ' +
        'text-gray-800 bg-gradient-to-br from-transparent to-gray-100 px-4' +
        ' ' +
        'rounded-full' +
        ' ' +
        'transition-shadow enabled:hover:shadow-xl enabled:hover:cursor-pointer' +
        ' ' +
        'disabled:text-gray-600 disabled:border-2 disabled:border-gray-200 disabled:opacity-30' +
        ' ' +
        className
      }>
      <span className="flex-1" />
      {children}
      {label && <span className="mx-1">{label}</span>}
      <span className="flex-1" />
    </button>
  );
}
