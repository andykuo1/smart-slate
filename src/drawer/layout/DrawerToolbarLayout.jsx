/**
 * @param {object} props
 * @param {import('react').MutableRefObject<HTMLDivElement|null>} [props.containerRef]
 * @param {boolean} [props.open]
 * @param {import('react').ReactNode} [props.toolbar]
 * @param {import('react').ReactNode} props.children
 */
export default function DrawerToolbarLayout({
  containerRef,
  open = false,
  toolbar,
  children,
}) {
  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 right-0 m-2 z-50 flex flex-row-reverse text-2xl gap-2 pointer-events-none text-black">
      {children}
      <div
        className={
          'flex flex-row-reverse gap-2 pointer-events-auto' +
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
