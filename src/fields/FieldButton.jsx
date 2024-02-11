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
export default function FieldButton({
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
        'flex select-none flex-row items-center rounded' +
        ' ' +
        'disabled:opacity-30' +
        ' ' +
        (children ? 'p-2 outline' : 'p-1') +
        ' ' +
        (danger
          ? 'enabled:hover:bg-red-500 enabled:hover:text-white'
          : inverted
            ? 'bg-black text-white enabled:hover:bg-white enabled:hover:text-black'
            : 'enabled:hover:bg-black enabled:hover:text-white') +
        ' ' +
        (className ?? 'relative w-full')
      }
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={title}
      disabled={disabled}>
      {Icon && <Icon className="h-[2em] w-[2em] fill-current" />}
      {typeof children === 'string' ? (
        <div className="flex-1 text-center">{children}</div>
      ) : (
        <div className="flex flex-1 items-center">{children}</div>
      )}
    </button>
  );
}
