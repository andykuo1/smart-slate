import { useEffect, useRef, useState } from 'react';

import GridViewIcon from '@material-symbols/svg-400/rounded/grid_view.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';

/**
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.toolbar
 * @param {import('react').ReactNode} props.content
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.darkMode]
 */
export default function DrawerLayout({ toolbar, content, children, darkMode }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const toolbarRef = useRef(/** @type {HTMLDivElement|null} */ (null));

  useEffect(() => {
    /** @param {Event} e */
    function onClick(e) {
      if (open) {
        const target = /** @type {HTMLElement} */ (e.target);
        if (
          !drawerRef.current?.contains(target) &&
          !toolbarRef.current?.contains(target)
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
      <div
        ref={toolbarRef}
        className="fixed bottom-0 right-0 m-4 z-50 flex flex-row-reverse text-2xl gap-2 pointer-events-none">
        <SettingsFieldButton
          className={
            'pointer-events-auto rounded-full p-2 z-10 shadow-md' +
            ' ' +
            (darkMode ? 'bg-black' : 'bg-white')
          }
          inverted={darkMode}
          Icon={GridViewIcon}
          onClick={() => setOpen((prev) => !prev)}
        />
        <div
          className={
            'flex flex-row-reverse gap-2 pointer-events-auto' +
            ' ' +
            'transition-transform' +
            ' ' +
            (open
              ? 'translate-x-0 opacity-100'
              : 'translate-x-[200%] opacity-0')
          }>
          {toolbar}
        </div>
      </div>
      <div
        ref={drawerRef}
        className={
          'fixed top-0 bottom-0 right-0 z-40 pb-20 overflow-y-auto overscroll-none' +
          ' ' +
          'shadow-xl bg-gray-200' +
          ' ' +
          'w-[90vw] sm:w-[60vmin] min-w-[50vw]' +
          ' ' +
          'transition-transform' +
          ' ' +
          (open ? 'translate-x-0' : 'translate-x-[100%]')
        }>
        {content}
      </div>
      {children}
    </>
  );
}
