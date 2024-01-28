/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {boolean} [props.danger]
 * @param {boolean} [props.inverted]
 * @param {import('react').FC<any>} [props.Icon]
 * @param {string} [props.title]
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} [props.disabled]
 */
export default function SettingsFieldButton({
  className,
  onClick,
  Icon,
  title,
  children,
  danger,
  inverted,
  disabled = !onClick,
}) {
  return (
    <button
      className={
        'w-full flex flex-row items-center rounded p-2' +
        ' ' +
        'disabled:opacity-30' +
        ' ' +
        (children ? 'outline' : '') +
        ' ' +
        (danger
          ? 'enabled:hover:bg-red-500 enabled:hover:text-white'
          : inverted
            ? 'enabled:hover:bg-white enabled:hover:text-black bg-black text-white'
            : 'enabled:hover:bg-black enabled:hover:text-white') +
        ' ' +
        className
      }
      onClick={onClick}
      title={title}
      disabled={disabled}>
      {Icon && <Icon className="w-6 h-6 fill-current" />}
      <span className="flex-1">{children}</span>
    </button>
  );
}
