import NavBar from './NavBar';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function NavBarLayout({ children }) {
  return (
    <>
      <div className="relative flex-1 flex flex-col items-center overflow-y-auto">
        {children}
      </div>
      {/* NOTE: Add some scrollable whitespace, because <NavBar/> is a floating element. */}
      <div className={'w-full h-20' /* TODO: Used to be h-24 */} />
      <NavBar />
    </>
  );
}
