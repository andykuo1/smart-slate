import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

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
  const drawerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const toolbarRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const drawerOpen = useUserStore((ctx) => ctx.drawer.open);
  const setDrawerActiveTab = useUserStore((ctx) => ctx.setDrawerActiveTab);
  const toggleDrawer = useUserStore((ctx) => ctx.toggleDrawer);
  const location = useLocation();
  const hasNavBar = location.pathname.includes('/edit');

  function onClick() {
    toggleDrawer();
    setDrawerActiveTab('outline');
  }

  useEffect(() => {
    /** @param {Event} e */
    function onClick(e) {
      if (!drawerOpen) {
        return;
      }
      const target = /** @type {HTMLElement} */ (e.target);
      if (
        !drawerRef.current?.contains(target) &&
        !toolbarRef.current?.contains(target)
      ) {
        toggleDrawer(false);
      }
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [drawerOpen, toggleDrawer]);

  return (
    <>
      <DrawerToolbarLayout
        className={hasNavBar ? 'bottom-20' : ''}
        containerRef={toolbarRef}
        open={drawerOpen}
        toolbar={toolbar}>
        <DrawerButton inverted={Boolean(darkMode)} onClick={onClick} />
      </DrawerToolbarLayout>
      <div
        ref={drawerRef}
        className={
          'fixed bottom-0 right-0 top-0 z-40 overflow-y-auto overscroll-none pb-20' +
          ' ' +
          'bg-gray-200 text-black shadow-xl' +
          ' ' +
          'w-[90vw] min-w-[50vw] sm:w-[60vmin]' +
          ' ' +
          'transition-transform' +
          ' ' +
          (drawerOpen ? 'translate-x-0' : 'translate-x-[100%]') +
          ' ' +
          (hasNavBar ? 'bottom-20' : '')
        }>
        {content}
      </div>
      {children}
    </>
  );
}
