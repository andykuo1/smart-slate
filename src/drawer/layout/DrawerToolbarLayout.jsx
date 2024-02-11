/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLDivElement|null>} [props.containerRef]
 * @param {boolean} [props.open]
 * @param {import('react').ReactNode} [props.toolbar]
 * @param {import('react').ReactNode} props.children
 */
export default function DrawerToolbarLayout({
  className,
  containerRef,
  open = false,
  toolbar,
  children,
}) {
  return (
    <div
      ref={containerRef}
      className={
        'fixed bottom-0 right-0' +
        ' ' +
        'pointer-events-none z-50 m-2 flex flex-row-reverse gap-2 text-2xl text-black' +
        ' ' +
        className
      }>
      {children}
      <div
        className={
          'pointer-events-auto flex flex-row-reverse gap-2' +
          ' ' +
          'transition-transform' +
          ' ' +
          (open ? 'translate-x-0 opacity-100' : 'translate-x-[200%] opacity-0')
        }>
        {toolbar}
      </div>
    </div>
  );
}
