import { MenuItem } from '@ariakit/react';
import { useCallback } from 'react';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import { clearVideoCache } from '@/stores/VideoCache';
import MenuStyle from '@/styles/Menu.module.css';

export default function ClearVideoCacheMenuItem() {
  const handleClick = useCallback(function handleClick() {
    if (window.confirm('Are you sure you want to clear ALL video cache?')) {
      clearVideoCache();
    }
  }, []);

  return (
    <MenuItem
      className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
      onClick={handleClick}>
      <DeleteIcon className="h-full fill-current" />
      Clear Video Cache
    </MenuItem>
  );
}
