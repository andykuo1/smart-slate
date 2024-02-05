import { useEffect, useRef, useState } from 'react';

import { useUserStore } from '@/stores/user';

import DrawerButton from './DrawerButton';
import DrawerToolbarLayout from './DrawerToolbarLayout';

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
  const setDrawerMode = useUserStore((ctx) => ctx.setDrawerMode);

  function onClick() {
    setOpen((prev) => !prev);
    setDrawerMode('outline');
  }

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
      <DrawerToolbarLayout
        containerRef={toolbarRef}
        open={open}
        toolbar={toolbar}>
        <DrawerButton inverted={Boolean(darkMode)} onClick={onClick} />
      </DrawerToolbarLayout>
      <div
        ref={drawerRef}
        className={
          'fixed top-0 bottom-0 right-0 z-40 pb-20 overflow-y-auto overscroll-none' +
          ' ' +
          'shadow-xl bg-gray-200 text-black' +
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
