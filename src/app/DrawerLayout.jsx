import { useEffect, useRef, useState } from 'react';

import GridViewIcon from '@material-symbols/svg-400/rounded/grid_view.svg';

/**
 *
 * @param {object} props
 * @param {() => import('react').ReactNode} props.content
 * @param {import('react').ReactNode} props.children
 */
export default function DrawerLayout({ content, children }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const drawerButtonRef = useRef(/** @type {HTMLButtonElement|null} */ (null));

  useEffect(() => {
    /** @param {Event} e */
    function onClick(e) {
      if (open) {
        const target = /** @type {HTMLElement} */ (e.target);
        if (
          !drawerRef.current?.contains(target) &&
          !drawerButtonRef.current?.contains(target)
        ) {
          setOpen(false);
        }
      }
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [open]);

  return (
    <>
      <button
        ref={drawerButtonRef}
        className="fixed bottom-0 right-0 z-50 bg-white rounded-full p-2 m-4 shadow-md"
        onClick={() => setOpen((prev) => !prev)}>
        <GridViewIcon className="fill-current" />
      </button>
      <div
        ref={drawerRef}
        className={
          'fixed top-0 bottom-0 right-0 z-40 pb-20 overflow-y-auto overscroll-none' +
          ' ' +
          'shadow-xl bg-gray-200' +
          ' ' +
          'w-[90vw] sm:w-[60vmin] min-w-[40vw]' +
          ' ' +
          'transition-transform' +
          ' ' +
          (open ? 'translate-x-0' : 'translate-x-[100%]')
        }>
        {content()}
      </div>
      {children}
    </>
  );
}
