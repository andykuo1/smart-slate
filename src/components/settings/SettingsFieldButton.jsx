/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {boolean} [props.danger]
 * @param {import('react').FC<any>} props.Icon
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.disabled]
 */
export default function SettingsFieldButton({
  className,
  onClick,
  Icon,
  children,
  danger,
  disabled = !onClick,
}) {
  return (
    <button
      className={
        'w-full flex flex-row items-center outline rounded p-2 my-4' +
        ' ' +
        'disabled:opacity-30 enabled:hover:text-white' +
        ' ' +
        (danger ? 'enabled:hover:bg-red-500' : 'enabled:hover:bg-black') +
        ' ' +
        className
      }
      onClick={onClick}
      disabled={disabled}>
      <Icon className="w-6 h-6 fill-current" />
      <span className="flex-1">{children}</span>
    </button>
  );
}
