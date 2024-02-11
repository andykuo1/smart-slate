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
          ? 'from-black to-gray-900 text-white disabled:border-gray-700 disabled:text-gray-400'
          : 'from-white to-gray-100 text-gray-800 disabled:border-gray-200 disabled:text-gray-600 dark:from-gray-800 dark:to-gray-700 dark:text-white dark:disabled:border-gray-700 dark:disabled:text-gray-400') +
        ' ' +
        'rounded-full bg-gradient-to-br' +
        ' ' +
        'transition-shadow enabled:hover:cursor-pointer enabled:hover:shadow-xl' +
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
