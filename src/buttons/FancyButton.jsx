/**
 * @param {object} props
 * @param {string} [props.title]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {string|import('react').ReactNode} [props.label]
 * @param {boolean} [props.inverted]
 * @param {import('react').ReactNode} [props.children]
 */
export default function FancyButton({
  title = '',
  onClick,
  className,
  label = title,
  inverted = false,
  disabled = !onClick,
  children,
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={
        'group flex flex-row items-center px-4' +
        ' ' +
        (inverted
          ? 'text-white from-black to-gray-900 disabled:text-gray-400 disabled:border-gray-700'
          : 'text-gray-800 from-white to-gray-100 disabled:text-gray-600 disabled:border-gray-200') +
        ' ' +
        'bg-gradient-to-br rounded-full' +
        ' ' +
        'transition-shadow enabled:hover:shadow-xl enabled:hover:cursor-pointer' +
        ' ' +
        'disabled:border-2 disabled:opacity-30' +
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
