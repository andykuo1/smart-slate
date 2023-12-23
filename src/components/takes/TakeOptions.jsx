import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';

import MoreVertIcon from '@material-symbols/svg-400/rounded/more_vert.svg';

import MenuStyle from '@/styles/Menu.module.css';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} [props.showButton]
 */
export default function TakeOptions({
  className,
  children,
  showButton = true,
}) {
  return (
    <MenuProvider>
      <MenuButton className={'flex flex-row items-center' + ' ' + className}>
        {children}
        {showButton && <MoreVertIcon className="w-6 h-6" />}
      </MenuButton>
      <Menu className={MenuStyle.menu}>
        <MenuItem className={MenuStyle.menuItem}>Reassign</MenuItem>
        <MenuItem className={MenuStyle.menuItem}>Upload</MenuItem>
        <MenuItem className={MenuStyle.menuItem}>Download</MenuItem>
        <MenuItem className={MenuStyle.menuItem}>Like</MenuItem>
        <MenuItem className={MenuStyle.menuItem}>Dislike</MenuItem>
      </Menu>
    </MenuProvider>
  );
}
