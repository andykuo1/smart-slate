/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onContextMenu]
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
  onContextMenu,
  Icon,
  title,
  children,
  danger,
  inverted,
  disabled = !onClick,
}) {
  return (
    <button
      style={{ lineHeight: '1em' }}
      className={
        'relative flex flex-row items-center rounded select-none' +
        ' ' +
        'disabled:opacity-30' +
        ' ' +
        (children ? 'outline p-2' : 'p-1') +
        ' ' +
        (danger
          ? 'enabled:hover:bg-red-500 enabled:hover:text-white'
          : inverted
            ? 'enabled:hover:bg-white enabled:hover:text-black bg-black text-white'
            : 'enabled:hover:bg-black enabled:hover:text-white') +
        ' ' +
        (className ?? 'w-full')
      }
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={title}
      disabled={disabled}>
      {Icon && <Icon className="w-[2em] h-[2em] fill-current" />}
      <span className="flex-1">{children}</span>
    </button>
  );
}
