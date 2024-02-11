/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {Array<import('react').ReactNode>} props.items
 * @param {import('react').ReactNode} props.children
 */
export default function NavBarLayout({ className, items, children }) {
  return (
    <>
      <div
        className={
          'relative mb-20 flex h-full w-full flex-col items-center overflow-y-auto' +
          ' ' +
          className
        }>
        {children}
      </div>
      <nav className="fixed bottom-0 z-40 flex h-20 w-full flex-col">
        <ul className="flex flex-1 flex-row bg-black text-white">
          {items.map((item, index) => (
            <li key={'nav-' + index} className="flex flex-1">
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
