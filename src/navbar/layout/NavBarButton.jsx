/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.title
 * @param {string} props.abbr
 * @param {import('react').ReactNode} [props.children]
 * @param {() => void} [props.onClick]
 * @param {import('react').FC<any>} props.Icon
 * @param {boolean} [props.active]
 * @param {boolean} [props.disabled]
 */
export default function NavButton({
  className,
  title,
  abbr,
  children,
  onClick,
  Icon,
  active,
  disabled = !onClick,
}) {
  return (
    <button
      className={
        // NOTE: This is pb-5, since pb-2 collides with iOS menu bar
        'group relative flex-1 p-2 pb-5' +
        ' ' +
        'enabled:cursor-pointer enabled:hover:bg-white enabled:hover:text-black disabled:opacity-30' +
        ' ' +
        (active ? 'bg-white text-black' : '') +
        ' ' +
        className
      }
      title={title}
      onClick={onClick}
      disabled={disabled}>
      {children}
      <Icon className="pointer-events-none m-auto h-10 w-10 fill-current" />
      <div
        className={
          'absolute -right-5 bottom-0 top-0 z-10 my-auto h-10 w-10 rotate-45 scale-50' +
          ' ' +
          'pointer-events-none' +
          ' ' +
          'bg-black group-enabled:group-hover:bg-white' +
          ' ' +
          (active ? 'bg-white' : '')
        }
      />
      <label className="pointer-events-none absolute top-[50%] z-20 my-auto ml-6 hidden -translate-y-[70%] sm:inline">
        <span className="hidden lg:inline">{title}</span>
        <span className="inline lg:hidden">{abbr}</span>
      </label>
    </button>
  );
}
