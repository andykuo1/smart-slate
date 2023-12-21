import { MenuItem } from '@ariakit/react';
import { useCallback, useState } from 'react';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';
import ToggleOff from '@material-symbols/svg-400/rounded/toggle_off.svg';
import ToggleOn from '@material-symbols/svg-400/rounded/toggle_on-fill.svg';

import { useInterval } from '@/lib/UseInterval';
import {
  useGAPILogin,
  useGAPILogout,
  useGAPITokenHandler,
} from '@/lib/googleapi';
import MenuStyle from '@/styles/Menu.module.css';

export default function EnableCloudSyncMenuItem() {
  const [dest, setDest] = useState('local');
  const login = useGAPILogin();
  const logout = useGAPILogout();
  const tokenHandler = useGAPITokenHandler();
  const onInterval = useCallback(() => {
    if (!tokenHandler(() => setDest('drive'))) {
      setDest('local');
    }
  }, [tokenHandler]);
  useInterval(onInterval, 3_000);
  return (
    <>
      <MenuItem
        className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
        onClick={() => {
          if (dest === 'local') {
            login();
          } else {
            logout();
          }
        }}>
        {dest !== 'local' ? (
          <ToggleOn className="h-full" />
        ) : (
          <ToggleOff className="h-full" />
        )}
        Sync to
        <AddToDriveIcon className="w-6 h-6 fill-current" /> Drive
      </MenuItem>
    </>
  );
}
