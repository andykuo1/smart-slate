import NavBar from './NavBar';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function NavBarLayout({ children }) {
  return (
    <>
      <div className="flex-1 flex flex-col items-center overflow-y-auto py-2">
        {children}
      </div>
      <div className={'h-12' /* TODO: Used to be h-24 */}>
        {/* NOTE: Add some scrollable whitespace, because <NavBar/> is a floating element. */}
        <NavBar />
      </div>
    </>
  );
}
